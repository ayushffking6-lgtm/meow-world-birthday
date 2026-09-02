/* =========================================================
   MEOW WORLD — OPTIMIZED COMPLETE SCRIPT
   MOBILE PERFORMANCE OPTIMIZED
   ---------------------------------------------------------
   FINAL FIREWORK FLOW:

   Final Page Opens
        ↓
   1 SEC WAIT
        ↓
   BIG ROCKET LAUNCH
        ↓
   BIG ROCKET BURSTS
        ↓
   2.9 SEC WAIT
        ↓
   10 NORMAL ROCKETS TOGETHER
        ↓
   RANDOM NORMAL ROCKETS
        ↓
   CONTINUE FOR 3 MINUTES
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {

    id: "Jayu",

    password: "14/03/2026",

    name: "Jaya",

    nicknames: [
        "MERA BACHUU",
        "SHONIII",
        "MISS RAIKWAR JI"
    ],

    message:
        "MERA BACHUU, SHONIII, MISS RAIKWAR JI — tumhari smile aur tumhari presence meri favourite memories ka sabse beautiful part hai. Aaj ka din tumhara hai, aur ye little Meow World sirf tumhare liye. Happy Birthday, my love. Meowww 🐾💗",

    music: [1,2,3,4,5,6,7].map(
        n => `assets/music/song-${String(n).padStart(2, "0")}.mp3`
    ),

    backgrounds: [1,2,3,4,5,6,7].map(
        n => `assets/backgrounds/bg-${String(n).padStart(2, "0")}.jpg`
    ),

    FIREWORK_SOUND:
        "assets/music/Fireworks.mp3"

};


/* =========================================================
   PERFORMANCE SETTINGS
========================================================= */

const NORMAL_FIREWORK_DURATION = 12000;

const FINAL_FIREWORK_DURATION = 180000;

/*
   Chapter 01 fireworks sound
*/
const FIREWORK_SOUND_DURATION = 5000;

/*
   Final page opens
   ↓
   1 second
   ↓
   Big rocket starts
*/
const FINAL_PAGE_START_DELAY = 1000;

/*
   Safety limit for big rocket
*/
const BIG_ROCKET_MAX_DURATION = 6800;

/*
   Big burst animation itself
*/
const BIG_ROCKET_SPLASH_DURATION = 2000;

/*
   IMPORTANT FINAL DELAY

   Big rocket burst
   ↓
   EXACT 2.9 SEC
   ↓
   10 normal rockets
*/
const BIG_TO_NORMAL_DELAY = 2900;

/*
   Initial rockets
*/
const INITIAL_NORMAL_ROCKET_COUNT = 10;

/*
   Random rocket delay
*/
const RANDOM_ROCKET_MIN_DELAY = 800;

const RANDOM_ROCKET_MAX_DELAY = 1500;


/* =========================================================
   PAGES
========================================================= */

const PAGES = [

    [
        "01",
        `Welcome to <span class="name">${CONFIG.name}</span>'s Meow World`,
        `"Bas ek chhoti si duniya… jahan har corner mein tumhari yaad hai."`,
        "cake-cat.jpeg",
        "page1",
        4
    ],

    [
        "02",
        `For my <span class="name">${CONFIG.name}</span>`,
        `"Tum meri story ka woh page ho jise main baar-baar read karna chahta hoon."`,
        "her-cat.jpeg",
        "page2",
        4
    ],

    [
        "03",
        `Us, one memory at a time`,
        `"Humari memories perfect nahi, par meri favourite zaroor hain."`,
        "heart-cat.jpeg",
        "page3",
        4
    ],

    [
        "04",
        `Our little game moments`,
        `"Win ho ya loss… one more game toh banta hai."`,
        "game-cat.jpeg",
        "page4",
        5
    ],

    [
        "05",
        `A little page from me`,
        `"Jo words saamne bolna mushkil hain, woh yahan likh diye."`,
        "letter-cat.jpeg",
        "page5",
        2
    ],

    [
        "06",
        `Make a wish, <span class="name">${CONFIG.name}</span>`,
        `"Har candle ke saath ek wish… aur har ek wish ke baad meri ek puchi vali letters....."`,
        "cake-cat.jpeg",
        "page6",
        1
    ],

    [
        "07",
        `My Dear Love <span class="name">${CONFIG.name}</span>`,
        `"Happy Birthday, MERA BACHUU. Meowww 🐾"`,
        "final-cat.jpeg",
        "page7",
        1
    ]

];


/* =========================================================
   GLOBAL STATE
========================================================= */

let current = 0;

let track = 0;

let slide = 0;

let timer = null;

let busy = false;


/* =========================================================
   FIREWORK STATES
========================================================= */

let normalFireworkRun = null;

let finalFireworkActive = false;

let finalFireworkAnimation = null;

let finalFireworkStartTimer = null;

let finalFireworkAudio = null;

let finalRandomLaunchTimer = null;


/* =========================================================
   DOM
========================================================= */

const story =
    document.getElementById("story");

const audio =
    document.getElementById("audio");

const fallback =
    "assets/cats/fallback-cat.jpeg";


/* =========================================================
   IMAGE CACHE
   Only cache images after they are requested.
========================================================= */

const imageCache =
    new Map();


function preloadImage(src) {

    if (!src) {
        return;
    }

    if (imageCache.has(src)) {
        return imageCache.get(src);
    }

    const img =
        new Image();

    img.decoding = "async";

    img.src = src;

    imageCache.set(
        src,
        img
    );

}


/* =========================================================
   LAZY PRELOAD CURRENT PAGE
========================================================= */

function preloadPageImages(index) {

    const page =
        PAGES[index];

    if (!page) {
        return;
    }

    preloadImage(
        CONFIG.backgrounds[index]
    );

    preloadImage(
        `assets/cats/${page[3]}`
    );


    const folder =
        page[4];

    const count =
        page[5];


    const limit =
        Math.min(
            count,
            3
        );


    for (
        let i = 1;
        i <= limit;
        i++
    ) {

        preloadImage(
            path(
                folder,
                i
            )
        );

    }

}


/* =========================================================
   PRELOAD NEXT PAGE ONLY
========================================================= */

function preloadNextPage(index) {

    const nextIndex =
        index + 1;

    if (
        nextIndex >=
        PAGES.length
    ) {

        return;

    }

    /*
       Delay preload slightly so current
       page gets priority.
    */

    setTimeout(() => {

        if (
            current === index
        ) {

            preloadPageImages(
                nextIndex
            );

        }

    }, 1200);

}


/* =========================================================
   FIREWORK AUDIO
========================================================= */

function createFireworkAudio() {

    if (!finalFireworkAudio) {

        finalFireworkAudio =
            new Audio(
                CONFIG.FIREWORK_SOUND
            );

        /*
           IMPORTANT:
           Do not download entire audio
           immediately.
        */

        finalFireworkAudio.preload =
            "metadata";

        finalFireworkAudio.loop =
            false;

        finalFireworkAudio.volume =
            0.85;

    }

    return finalFireworkAudio;

}


/* =========================================================
   CHAPTER 01 FIREWORK SOUND
========================================================= */

function playChapterOneFireworkSound() {

    const sound =
        createFireworkAudio();

    try {

        sound.pause();

        sound.currentTime = 0;

        sound.loop = false;

        sound.volume = 0.85;

        const promise =
            sound.play();

        if (
            promise &&
            promise.catch
        ) {

            promise.catch(
                () => {}
            );

        }


        setTimeout(() => {

            try {

                sound.pause();

                sound.currentTime = 0;

            }

            catch (e) {}

        }, FIREWORK_SOUND_DURATION);

    }

    catch (e) {

        console.log(
            "Firework sound error:",
            e
        );

    }

}


/* =========================================================
   FINAL FIREWORK AUDIO
========================================================= */

function startFinalFireworkAudio() {

    const sound =
        createFireworkAudio();

    try {

        sound.pause();

        sound.currentTime = 0;

        sound.loop = true;

        sound.volume = 0.85;

        const promise =
            sound.play();

        if (
            promise &&
            promise.catch
        ) {

            promise.catch(
                () => {}
            );

        }

    }

    catch (e) {

        console.log(
            "Final fireworks audio error:",
            e
        );

    }

}


/* =========================================================
   STOP AUDIO
========================================================= */

function stopFinalFireworkAudio() {

    if (
        !finalFireworkAudio
    ) {

        return;

    }

    try {

        finalFireworkAudio.pause();

        finalFireworkAudio.currentTime =
            0;

        finalFireworkAudio.loop =
            false;

    }

    catch (e) {}

}


/* =========================================================
   CANVAS RESIZE
========================================================= */

function resizeCanvas() {

    const canvas =
        document.getElementById(
            "fireworks"
        );

    if (!canvas) {
        return;
    }


    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            1.5
        );


    /*
       Avoid unnecessary resize
    */

    const targetWidth =
        Math.floor(
            innerWidth * dpr
        );

    const targetHeight =
        Math.floor(
            innerHeight * dpr
        );


    if (
        canvas.width !==
        targetWidth ||
        canvas.height !==
        targetHeight
    ) {

        canvas.width =
            targetWidth;

        canvas.height =
            targetHeight;

        canvas.style.width =
            innerWidth + "px";

        canvas.style.height =
            innerHeight + "px";

    }


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


/* =========================================================
   NORMAL BURST
========================================================= */

function makeNormalBurst(
    x,
    y,
    count = 85
) {

    const particles = [];

    const baseHue =
        Math.random() * 360;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const angle =
            Math.PI * 2 * i / count +
            Math.random() * 0.16;

        const speed =
            2.4 +
            Math.random() * 4.8;


        particles.push({

            x,
            y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 1,

            size:
                1 +
                Math.random() * 1.7,

            hue:
                (
                    baseHue +
                    Math.random() * 60
                ) % 360

        });

    }


    return particles;

}


/* =========================================================
   NORMAL FIREWORKS
========================================================= */

function fireworks(
    duration =
        NORMAL_FIREWORK_DURATION
) {

    const canvas =
        document.getElementById(
            "fireworks"
        );

    if (!canvas) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    resizeCanvas();


    if (normalFireworkRun) {

        normalFireworkRun.stop =
            true;

    }


    const run = {

        stop: false,

        until:
            performance.now() +
            duration,

        rocket: null,

        bursts: []

    };


    normalFireworkRun =
        run;


    function launchRocket() {

        run.rocket = {

            x:
                innerWidth *
                (
                    0.08 +
                    Math.random() * 0.84
                ),

            y:
                innerHeight + 25,

            vx:
                (
                    Math.random() -
                    0.5
                ) * 0.75,

            vy:
                -10.2 -
                Math.random() * 1.8,

            target:
                innerHeight *
                (
                    0.12 +
                    Math.random() * 0.30
                ),

            trail: []

        };

    }


    function step(now) {

        if (run.stop) {
            return;
        }


        if (
            !run.rocket &&
            now < run.until
        ) {

            launchRocket();

        }


        ctx.clearRect(
            0,
            0,
            innerWidth,
            innerHeight
        );


        ctx.globalCompositeOperation =
            "lighter";


        /* ROCKET */

        if (run.rocket) {

            const r =
                run.rocket;


            r.trail.push({
                x: r.x,
                y: r.y
            });


            if (
                r.trail.length >
                8
            ) {

                r.trail.shift();

            }


            for (
                let i = 0;
                i < r.trail.length;
                i++
            ) {

                const p =
                    r.trail[i];


                ctx.beginPath();

                ctx.arc(
                    p.x,
                    p.y,
                    Math.max(
                        0.8,
                        2.5 -
                        i * 0.18
                    ),
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    `rgba(
                        255,
                        225,
                        170,
                        ${1 -
                            i /
                            r.trail.length}
                    )`;


                ctx.fill();

            }


            r.x += r.vx;

            r.y += r.vy;

            r.vy += 0.055;


            if (
                r.y <=
                r.target
            ) {

                run.bursts.push(
                    ...makeNormalBurst(
                        r.x,
                        r.y,
                        90
                    )
                );

                run.rocket =
                    null;

            }

        }


        /* PARTICLES */

        for (
            let i =
                run.bursts.length - 1;
            i >= 0;
            i--
        ) {

            const p =
                run.bursts[i];


            p.x += p.vx;

            p.y += p.vy;

            p.vy += 0.065;

            p.vx *= 0.988;

            p.vy *= 0.988;

            p.life -= 0.018;


            if (
                p.life <= 0
            ) {

                run.bursts.splice(
                    i,
                    1
                );

                continue;

            }


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `hsla(
                    ${p.hue},
                    100%,
                    70%,
                    ${p.life}
                )`;


            ctx.fill();

        }


        if (
            now < run.until ||
            run.rocket ||
            run.bursts.length
        ) {

            requestAnimationFrame(
                step
            );

        }

        else {

            ctx.clearRect(
                0,
                0,
                innerWidth,
                innerHeight
            );


            if (
                normalFireworkRun ===
                run
            ) {

                normalFireworkRun =
                    null;

            }

        }

    }


    requestAnimationFrame(
        step
    );

}


/* =========================================================
   STOP NORMAL FIREWORKS
========================================================= */

function stopNormalFireworks() {

    if (
        normalFireworkRun
    ) {

        normalFireworkRun.stop =
            true;

        normalFireworkRun =
            null;

    }

}


/* =========================================================
   BIG NEON BURST
========================================================= */

function makeBigNeonBurst(
    x,
    y
) {

    const particles = [];

    /*
       Slightly reduced from 295
       for mobile performance.
    */

    const count = 175;

    const baseHue =
        Math.random() * 360;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            4.2 +
            Math.random() * 7;


        particles.push({

            x,
            y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 1,

            decay:
                0.012 +
                Math.random() * 0.009,

            size:
                1.4 +
                Math.random() * 2.8,

            hue:
                (
                    baseHue +
                    Math.random() * 120
                ) % 360

        });

    }


    /* RING */

    const ringCount = 65;


    for (
        let i = 0;
        i < ringCount;
        i++
    ) {

        const angle =
            Math.PI *
            2 *
            i /
            ringCount;

        const speed =
            7.5 +
            Math.random() * 2.5;


        particles.push({

            x,
            y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 1,

            decay:
                0.014,

            size:
                1.8 +
                Math.random() * 1.5,

            hue:
                (
                    30 +
                    i * 4
                ) % 360

        });

    }


    return particles;

}


/* =========================================================
   FINAL NORMAL ROCKET
========================================================= */

function createFinalNormalRocket() {

    return {

        x:
            innerWidth *
            (
                0.06 +
                Math.random() * 0.88
            ),

        y:
            innerHeight + 25,

        vx:
            (
                Math.random() -
                0.5
            ) * 0.9,

        vy:
            -10 -
            Math.random() * 2.2,

        target:
            innerHeight *
            (
                0.10 +
                Math.random() * 0.42
            ),

        trail: [],

        exploded: false

    };

}


/* =========================================================
   FINAL NORMAL BURST
========================================================= */

function makeFinalNormalBurst(
    x,
    y
) {

    return makeNormalBurst(
        x,
        y,
        75
    );

}


/* =========================================================
   INITIAL 10 ROCKETS
========================================================= */

function launchInitialFinalRockets(
    rockets
) {

    for (
        let i = 0;
        i <
        INITIAL_NORMAL_ROCKET_COUNT;
        i++
    ) {

        rockets.push(
            createFinalNormalRocket()
        );

    }

}


/* =========================================================
   RANDOM DELAY
========================================================= */

function randomRocketDelay() {

    return (
        RANDOM_ROCKET_MIN_DELAY +
        Math.random() *
        (
            RANDOM_ROCKET_MAX_DELAY -
            RANDOM_ROCKET_MIN_DELAY
        )
    );

}


/* =========================================================
   FINAL FIREWORK SYSTEM
========================================================= */

function startFinalFireworksLoop() {

    if (
        finalFireworkActive
    ) {

        return;

    }


    const canvas =
        document.getElementById(
            "fireworks"
        );


    if (!canvas) {
        return;
    }


    finalFireworkActive =
        true;


    resizeCanvas();


    const ctx =
        canvas.getContext(
            "2d"
        );


    const rockets = [];

    const bursts = [];


    const finalStart =
        performance.now();


    let finalNormalLaunchStarted =
        false;


    let bigRocketFinished =
        false;


    /* =====================================================
       BIG ROCKET
    ===================================================== */

    const bigRocket = {

        x:
            innerWidth *
            (
                0.34 +
                Math.random() * 0.32
            ),

        y:
            innerHeight + 40,

        vx:
            (
                Math.random() -
                0.5
            ) * 0.25,

        vy:
            -15.5,

        target:
            innerHeight * 0.17,

        trail: [],

        exploded: false,

        explosionTime: 0,

        particles: [],

        startedAt:
            performance.now()

    };


    /* =====================================================
       EXPLODE BIG ROCKET
    ===================================================== */

    function explodeBigRocket(now) {

        if (
            bigRocket.exploded
        ) {

            return;

        }


        bigRocket.exploded =
            true;


        bigRocket.explosionTime =
            now;


        bigRocket.particles =
            makeBigNeonBurst(
                bigRocket.x,
                bigRocket.y
            );

    }


    /* =====================================================
       DRAW BIG ROCKET
    ===================================================== */

    function drawBigRocket() {

        if (
            bigRocket.exploded
        ) {

            return;

        }


        bigRocket.trail.push({

            x:
                bigRocket.x,

            y:
                bigRocket.y

        });


        if (
            bigRocket.trail.length >
            18
        ) {

            bigRocket.trail.shift();

        }


        for (
            let i = 0;
            i <
            bigRocket.trail.length;
            i++
        ) {

            const p =
                bigRocket.trail[i];


            const alpha =
                1 -
                i /
                bigRocket.trail.length;


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                Math.max(
                    0.8,
                    4 -
                    i * 0.16
                ),
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    255,
                    220,
                    130,
                    ${alpha}
                )`;


            ctx.fill();

        }


        /* HEAD */

        ctx.beginPath();

        ctx.arc(
            bigRocket.x,
            bigRocket.y,
            4.5,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "rgba(255,255,255,1)";


        ctx.fill();


        /* GLOW */

        ctx.beginPath();

        ctx.arc(
            bigRocket.x,
            bigRocket.y,
            10,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "rgba(255,190,70,0.22)";


        ctx.fill();

    }


    /* =====================================================
       UPDATE BIG ROCKET
    ===================================================== */

    function updateBigRocket(now) {

        if (
            bigRocket.exploded
        ) {

            return;

        }


        drawBigRocket();


        bigRocket.x +=
            bigRocket.vx;

        bigRocket.y +=
            bigRocket.vy;

        bigRocket.vy +=
            0.035;


        if (
            bigRocket.y <=
            bigRocket.target
        ) {

            explodeBigRocket(
                now
            );

        }


        if (
            now -
            bigRocket.startedAt >
            BIG_ROCKET_MAX_DURATION
        ) {

            explodeBigRocket(
                now
            );

        }

    }


    /* =====================================================
       UPDATE BIG PARTICLES
    ===================================================== */

    function updateBigParticles(now) {

        if (
            !bigRocket.exploded
        ) {

            return;

        }


        const elapsed =
            now -
            bigRocket.explosionTime;


        const progress =
            Math.min(
                1,
                elapsed /
                BIG_ROCKET_SPLASH_DURATION
            );


        for (
            let i =
                bigRocket.particles.length - 1;
            i >= 0;
            i--
        ) {

            const p =
                bigRocket.particles[i];


            p.x += p.vx;

            p.y += p.vy;

            p.vx *= 0.982;

            p.vy *= 0.982;

            p.vy += 0.045;


            p.life =
                Math.max(
                    0,
                    1 - progress
                );


            if (
                p.life <= 0
            ) {

                bigRocket.particles.splice(
                    i,
                    1
                );

                continue;

            }


            /* Glow */

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size * 3.2,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `hsla(
                    ${p.hue},
                    100%,
                    65%,
                    ${p.life * 0.12}
                )`;


            ctx.fill();


            /* Main */

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `hsla(
                    ${p.hue},
                    100%,
                    72%,
                    ${p.life}
                )`;


            ctx.fill();

        }


        /*
           Big burst animation finished.
        */

        if (
            elapsed >=
            BIG_ROCKET_SPLASH_DURATION
        ) {

            bigRocket.particles.length =
                0;

            bigRocketFinished =
                true;

        }

    }


    /* =====================================================
       UPDATE NORMAL ROCKETS
    ===================================================== */

    function updateNormalRockets() {

        for (
            let i =
                rockets.length - 1;
            i >= 0;
            i--
        ) {

            const r =
                rockets[i];


            if (
                !r.exploded
            ) {

                r.trail.push({

                    x: r.x,

                    y: r.y

                });


                if (
                    r.trail.length >
                    7
                ) {

                    r.trail.shift();

                }


                for (
                    let t = 0;
                    t <
                    r.trail.length;
                    t++
                ) {

                    const p =
                        r.trail[t];


                    ctx.beginPath();

                    ctx.arc(
                        p.x,
                        p.y,
                        Math.max(
                            0.8,
                            2.4 -
                            t * 0.17
                        ),
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        `rgba(
                            255,
                            225,
                            165,
                            ${1 -
                                t /
                                r.trail.length}
                        )`;


                    ctx.fill();

                }


                r.x +=
                    r.vx;

                r.y +=
                    r.vy;

                r.vy +=
                    0.055;


                if (
                    r.y <=
                    r.target
                ) {

                    bursts.push(
                        ...makeFinalNormalBurst(
                            r.x,
                            r.y
                        )
                    );


                    rockets.splice(
                        i,
                        1
                    );

                }

            }

        }

    }


    /* =====================================================
       NORMAL PARTICLES
    ===================================================== */

    function updateNormalParticles() {

        for (
            let i =
                bursts.length - 1;
            i >= 0;
            i--
        ) {

            const p =
                bursts[i];


            p.x +=
                p.vx;

            p.y +=
                p.vy;

            p.vy +=
                0.055;

            p.vx *=
                0.989;

            p.vy *=
                0.989;

            p.life -=
                0.018;


            if (
                p.life <= 0
            ) {

                bursts.splice(
                    i,
                    1
                );

                continue;

            }


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `hsla(
                    ${p.hue},
                    95%,
                    70%,
                    ${p.life}
                )`;


            ctx.fill();

        }

    }


    /* =====================================================
       RANDOM ROCKET
    ===================================================== */

    function launchRandomNormalRocket() {

        if (
            !finalFireworkActive
        ) {

            return;

        }


        if (
            current !== 6
        ) {

            return;

        }


        rockets.push(
            createFinalNormalRocket()
        );


        /*
           Small chance of double rocket.
        */

        if (
            Math.random() < 0.20
        ) {

            rockets.push(
                createFinalNormalRocket()
            );

        }

    }


    /* =====================================================
       RANDOM SCHEDULER
    ===================================================== */

    function scheduleRandomRocket() {

        if (
            !finalFireworkActive ||
            current !== 6
        ) {

            return;

        }


        const delay =
            randomRocketDelay();


        finalRandomLaunchTimer =
            setTimeout(() => {

                if (
                    !finalFireworkActive ||
                    current !== 6
                ) {

                    return;

                }


                launchRandomNormalRocket();


                scheduleRandomRocket();

            }, delay);

    }


    /* =====================================================
       ANIMATION
    ===================================================== */

    function animate(now) {

        if (
            !finalFireworkActive
        ) {

            return;

        }


        if (
            current !== 6
        ) {

            stopFinalFireworksLoop();

            return;

        }


        /*
           EXACT 3 MINUTES
        */

        if (
            now -
            finalStart >=
            FINAL_FIREWORK_DURATION
        ) {

            stopFinalFireworksLoop();

            return;

        }


        ctx.clearRect(
            0,
            0,
            innerWidth,
            innerHeight
        );


        ctx.globalCompositeOperation =
            "lighter";


        /* =================================================
           BIG ROCKET
        ================================================= */

        if (
            !bigRocketFinished
        ) {

            updateBigRocket(
                now
            );

            updateBigParticles(
                now
            );

        }


        /* =================================================
           BIG BURST
           ↓
           EXACT 2.9 SEC WAIT
           ↓
           10 ROCKETS
        ================================================= */

        if (
            bigRocketFinished &&
            !finalNormalLaunchStarted
        ) {

            const timeSinceBigBurst =
                now -
                bigRocket.explosionTime;


            if (
                timeSinceBigBurst >=
                BIG_TO_NORMAL_DELAY
            ) {

                /*
                   Make absolutely sure
                   big particles are gone.
                */

                bigRocket.particles.length =
                    0;


                /*
                   EXACTLY 10
                */

                launchInitialFinalRockets(
                    rockets
                );


                finalNormalLaunchStarted =
                    true;


                /*
                   Random rockets start
                   AFTER initial 10.
                */

                scheduleRandomRocket();

            }

        }


        /* =================================================
           NORMAL FIREWORKS
        ================================================= */

        if (
            finalNormalLaunchStarted
        ) {

            updateNormalRockets();

            updateNormalParticles();

        }


        finalFireworkAnimation =
            requestAnimationFrame(
                animate
            );

    }


    finalFireworkAnimation =
        requestAnimationFrame(
            animate
        );

}


/* =========================================================
   STOP FINAL FIREWORKS
========================================================= */

function stopFinalFireworksLoop() {

    finalFireworkActive =
        false;


    if (
        finalFireworkAnimation
    ) {

        cancelAnimationFrame(
            finalFireworkAnimation
        );

        finalFireworkAnimation =
            null;

    }


    if (
        finalFireworkStartTimer
    ) {

        clearTimeout(
            finalFireworkStartTimer
        );

        finalFireworkStartTimer =
            null;

    }


    if (
        finalRandomLaunchTimer
    ) {

        clearTimeout(
            finalRandomLaunchTimer
        );

        finalRandomLaunchTimer =
            null;

    }


    stopFinalFireworkAudio();


    const canvas =
        document.getElementById(
            "fireworks"
        );


    if (canvas) {

        const ctx =
            canvas.getContext(
                "2d"
            );


        ctx.clearRect(
            0,
            0,
            innerWidth,
            innerHeight
        );

    }

}


/* =========================================================
   FINAL PAGE EFFECT
========================================================= */

function startFinalPageEffect() {

    stopFinalFireworksLoop();


    /*
       FINAL PAGE
       ↓
       1 SEC
       ↓
       BIG ROCKET
    */

    finalFireworkStartTimer =
        setTimeout(() => {

            if (
                current !== 6
            ) {

                return;

            }


            startFinalFireworksLoop();

            startFinalFireworkAudio();

        }, FINAL_PAGE_START_DELAY);

}


/* =========================================================
   PAGE FIREWORKS
========================================================= */

function pageFireworks() {

    if (
        current === 6
    ) {

        return;

    }


    fireworks(
        NORMAL_FIREWORK_DURATION
    );

}


/* =========================================================
   PATH
========================================================= */

function path(
    folder,
    n
) {

    return `assets/images/${folder}/image-${String(n).padStart(2, "0")}.jpg`;

}


/* =========================================================
   FLOATING DECORATIONS
========================================================= */

function floats() {

    const layer =
        document.getElementById(
            "floatLayer"
        );


    if (!layer) {
        return;
    }


    const chars = [

        "♡",
        "♥",
        "✦",
        "✧",
        "❀",
        "🌸",
        "🎀",
        "✿",
        "🐾"

    ];


    /*
       Slightly slower creation
       = better mobile performance.
    */

    setInterval(() => {

        /*
           Don't create unlimited elements.
        */

        if (
            layer.children.length >
            18
        ) {

            return;

        }


        const element =
            document.createElement(
                "span"
            );


        element.className =
            "floater";


        element.textContent =
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];


        element.style.left =
            Math.random() *
            100 +
            "vw";


        element.style.fontSize =
            12 +
            Math.random() *
            22 +
            "px";


        element.style.setProperty(
            "--dx",
            (
                Math.random() -
                0.5
            ) * 35 +
            "vw"
        );


        element.style.setProperty(
            "--rot",
            (
                Math.random() -
                0.5
            ) * 240 +
            "deg"
        );


        element.style.animationDuration =
            8 +
            Math.random() *
            8 +
            "s";


        layer.appendChild(
            element
        );


        setTimeout(
            () => {
                element.remove();
            },
            17000
        );


    }, 850);

}


/* =========================================================
   SLIDESHOW MARKUP
========================================================= */

function slidesMarkup(
    folder,
    count
) {

    const total =
        Math.max(
            1,
            count
        );


    const shown =
        Math.min(
            3,
            total
        );


    return `

        <div class="square-showcase">

            ${Array.from(
                {
                    length: shown
                },
                (_, j) => `

                    <div class="square-slide">

                        <img
                            id="slide${j}"
                            src="${path(
                                folder,
                                j + 1
                            )}"
                            loading="${
                                j === 0
                                    ? "eager"
                                    : "lazy"
                            }"
                            decoding="async"
                            onerror="this.src='${fallback}'"
                        >

                        <div
                            class="caption"
                            id="cap${j}"
                        >

                            ${
                                [
                                    "MERA BACHUU 💗",
                                    "SHONIII ✨",
                                    "MISS RAIKWAR JI 🌸"
                                ][j]
                            }

                        </div>

                    </div>

                `
            ).join("")}

        </div>


        <div class="controls">

            <button
                onclick="moveSlide(-1)"
            >
                ←
            </button>

            <span id="dots">
                01 / ${total}
            </span>

            <button
                onclick="moveSlide(1)"
            >
                →
            </button>

        </div>

    `;

}


/* =========================================================
   MOVE SLIDE
========================================================= */

function moveSlide(
    dir
) {

    const page =
        PAGES[current];


    if (!page) {
        return;
    }


    const folder =
        page[4];


    const count =
        page[5];


    if (
        count <= 3
    ) {

        return;

    }


    slide =
        (
            slide +
            dir +
            count
        ) % count;


    for (
        let j = 0;
        j < 3;
        j++
    ) {

        const image =
            document.getElementById(
                "slide" + j
            );


        if (image) {

            const index =
                (
                    slide +
                    j
                ) % count;


            const src =
                path(
                    folder,
                    index + 1
                );


            /*
               Preload image before
               changing visible image.
            */

            preloadImage(src);


            image.style.opacity =
                "0";


            setTimeout(() => {

                if (
                    current !==
                    PAGES.indexOf(page)
                ) {

                    return;

                }


                image.src =
                    src;


                image.style.opacity =
                    "1";


            }, 180);

        }

    }


    const dots =
        document.getElementById(
            "dots"
        );


    if (dots) {

        dots.textContent =
            `${String(
                slide + 1
            ).padStart(2, "0")} / ${count}`;

    }

}


/* =========================================================
   CAKE
========================================================= */

function cake() {

    return `

        <div class="cake-stage">

            <div class="cake-wrap emoji-cake-wrap">

                <div class="candles">

                    ${
                        Array.from(
                            {
                                length: 9
                            },
                            (_, i) => `

                                <button
                                    class="candle candle-${i + 1}"
                                    data-i="${i}"
                                    aria-label="Candle ${i + 1}"
                                >

                                    <span class="flame"></span>

                                </button>

                            `
                        ).join("")
                    }

                </div>


                <div
                    class="emoji-cake"
                    aria-label="Birthday cake"
                >

                    🎂

                </div>

            </div>


            <p class="cake-instruction">

                Blow up the candles

            </p>


            <div
                class="letter"
                id="letter"
            >

                <h2>
                    My Dear Love,
                </h2>


                <p>
                    ${CONFIG.message}
                </p>


                <button
                    class="primary"
                    onclick="next()"
                >

                    Open the final page ✨

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   BIND CANDLES
========================================================= */

function bindCandles() {

    document
        .querySelectorAll(".candle")
        .forEach(
            candle => {

                candle.onclick =
                    () => {

                        if (
                            candle.classList.contains(
                                "off"
                            )
                        ) {

                            return;

                        }


                        candle.classList.add(
                            "off"
                        );


                        const remaining =
                            document.querySelectorAll(
                                ".candle:not(.off)"
                            ).length;


                        if (
                            remaining === 0
                        ) {

                            setTimeout(
                                () => {

                                    const letter =
                                        document.getElementById(
                                            "letter"
                                        );


                                    if (
                                        letter
                                    ) {

                                        letter.classList.add(
                                            "show"
                                        );

                                    }


                                    fireworks(
                                        NORMAL_FIREWORK_DURATION
                                    );


                                },
                                650
                            );

                        }

                    };

            }
        );

}


/* =========================================================
   NOTE + VIDEO
========================================================= */

function note() {

    return `

        <div class="note-video">

            <div class="paper">

                <img
                    src="assets/images/notes/handwritten.jpg"
                    loading="lazy"
                    decoding="async"
                    onerror="this.src='assets/cats/note-placeholder.jpeg'"
                >

            </div>


            <div class="video-box">

                <video
                    controls
                    playsinline
                    preload="metadata"
                    src="assets/video/my-message.mp4"
                ></video>


                <p class="lead">

                    "Jo saamne bolna mushkil tha… video mein bol diya. ❤️"

                </p>

            </div>

        </div>

    `;

}


/* =========================================================
   FINAL PAGE
========================================================= */

function finalPage() {

    return `

        <div class="final">

            <div>

                <div style="font-size:70px">
                    🐈‍⬛
                </div>


                <div class="kicker">
                    THE LAST PAGE
                </div>


                <h1>

                    My Dear Love<br>

                    <span class="name">
                        ${CONFIG.name}
                    </span>

                </h1>


                <p class="quote">

                    Meowww 🐾<br>

                    <span class="name">
                        ${CONFIG.nicknames.join(" • ")}
                    </span>

                </p>


                <p class="lead">
                    ${CONFIG.message}
                </p>

            </div>

        </div>

    `;

}


/* =========================================================
   MUSIC
========================================================= */

function setTrack(
    i
) {

    track = i;


    if (!audio) {
        return;
    }


    audio.pause();


    /*
       Reset only if possible.
    */

    try {
        audio.currentTime = 0;
    }
    catch (e) {}


    audio.src =
        CONFIG.music[i];


    audio.loop =
        true;


    /*
       PERFORMANCE:
       Don't force full song download.
    */

    audio.preload =
        "metadata";


    const volume =
        document.getElementById(
            "volume"
        );


    if (volume) {

        audio.volume =
            +volume.value;

    }


    const trackName =
        document.getElementById(
            "trackName"
        );


    if (trackName) {

        trackName.textContent =
            `Chapter ${String(
                i + 1
            ).padStart(2, "0")}`;

    }


    /*
       Give browser a moment to
       release previous audio.
    */

    const promise =
        audio.play();


    if (
        promise &&
        promise.catch
    ) {

        promise.catch(
            () => {}
        );

    }

}


/* =========================================================
   RENDER
========================================================= */

function render(
    i
) {

    if (
        i < 0 ||
        i >= PAGES.length
    ) {

        return;

    }


    if (
        current === 6 &&
        i !== 6
    ) {

        stopFinalFireworksLoop();

    }


    stopNormalFireworks();


    clearInterval(
        timer
    );


    current =
        i;


    slide =
        0;


    const page =
        PAGES[i];


    const isCake =
        i === 5;


    const isFinal =
        i === 6;


    let special;


    if (isCake) {

        special =
            cake();

    }

    else if (
        i === 4
    ) {

        special =
            note();

    }

    else if (isFinal) {

        special =
            finalPage();

    }

    else {

        special =
            slidesMarkup(
                page[4],
                page[5]
            );

    }


    let heroButton =
        "";


    if (
        !isCake &&
        !isFinal
    ) {

        heroButton = `

            <button
                class="primary"
                onclick="next()"
            >

                Next chapter →

            </button>

        `;

    }


    const nextButton =
        i < 6 &&
        !isCake

            ? `

                <button
                    class="secondary"
                    onclick="next()"
                >

                    Next →

                </button>

            `

            : "";


    const leads = [

        `
        It’s been 21 years, 7,670 days, 184,080 hours,
        11,044,800 minutes, 662,688,000 seconds,
        and countless beautiful moments of you being you ❤️
        And after all this time, I just want you to know
        how incredibly special you are to me, Meri Jaya,
        meri Cutie Pie, meri Sugarplum, tumhari smile mere
        liye duniya ki sabse beautiful cheezon mein se ek hai,
        Tumhare saath bitaya har moment mere liye ek precious
        memory hai, chahe woh random conversations ho, games ho,
        hasi mazaak ho, ya bas ek dusre ko annoy karna ho,
        I love every little part of it, I hope tumhari life
        hamesha happiness, success aur beautiful memories se
        filled rahe, aur tumhare saare dreams slowly slowly
        reality bane, Bas aise hi hamesha khush rehna,
        smile karti rehna, aur meri wahi cute si Jaya rehna,
        Happy Birthday meri Jaya ❤️ Meowww forever 🐾❤️
        `,

        `
        Meri Jaya, meri Cutie Pie, meri Sugarplum,
        Happy Birthday to the most special person in my little world ❤️
        Aaj ka din sirf tumhara birthday nahi hai,
        its a celebration of you, the person who somehow
        makes ordinary moments feel a little more beautiful,
        Kabhi kabhi mujhe samajh nahi aata ki main words mein
        exactly kaise explain karun ki tum mere liye kitni special ho,
        Bas itna pata hai ki tumhari ek smile mera pura mood change
        kar sakti hai, aur tumhari ek chhoti si baat bhi kabhi kabhi
        mere din ka favourite moment ban jaati hai, Meri Cutie Pie,
        tumhare saath bitaye hue moments mere liye sirf memories
        nahi hain, they are little pieces of happiness that I want
        to keep forever, Chahe hum game khel rahe ho,
        random baatein kar rahe ho, ya bas ek dusre ko annoy
        kar rahe ho, somehow everything becomes special because
        its us, Meri Sugarplum, I hope tum hamesha smile karti raho,
        apne dreams chase karo, aur life mein woh sab pao jo tum
        deserve karti ho, Aur haan, thoda sa pagalpan aur cute drama
        bhi hamesha maintain rakhna 😂❤️ Thank you for being you,
        Thank you for every laugh, every memory, every little moment,
        Happy Birthday, meri Jaya, Stay happy, stay crazy,
        stay beautifully you, Meowww forever, Cutie Pie 🐾❤️
        `,

        `
        Kuch moments loud hote hain,
        kuch quietly favourite ban jaate hain.
        `,

        `
        Humare game screenshots —
        because kuch fights screen par hoti hain
        aur kuch sirf hasi ke liye.
        `,

        `
        MERA BACHUU, ye page thoda personal hai.
        Ye page thoda personal hai, kyunki kabhi kabhi
        humari misunderstandings ki wajah se fights ho jaati hain,
        but meri Jaya, please kisi bhi moment ko permanent
        mat samajhna, har problem ke baad things better ho sakti hain,
        bas mujhpar aur humpar thoda sa trust rakhna,
        kyunki misunderstandings temporary hoti hain,
        but what we mean to each other is much more special ❤️
        `,

        `
        Cake ko touch karke candles ek-ek karke bujhana.
        Tumhare liye kuch hai last candle mein.
        `,

        `
        No more spoilers.
        Bas ek birthday wish, straight from me.
        `

    ];


    const sectionTitles = [

        "The first little reveal.",

        "Her, in little frames.",

        "Us, one square at a time.",

        "Game moments.",

        "From me, to you, kitne pyare lg re haaye mere bchuuuuuu hehehhe kr re.......muahhhhhhhh muahhhhhh muahhhhh >3.",

        "Make a wish. And Mahadev ji bless u a lott tumko duniya ki har khushi mile , tumahri saari problms bhagvan ji khtm kr dege , hmesha muskurate rhooo.",

        "The last little corner, if meko life me kbhi bhi ek mauka mile to me is choti jaya se milne jarur jauga past m , haye mera innocent bchuu meri little cat ."

    ];


    /*
       Background image
       remains same visually.
    */

    const background =
        `background-image:url('${CONFIG.backgrounds[i]}')`;


    story.innerHTML = `

        <section
            class="page"
            style="${background}"
        >

            <div class="content">

                <div class="hero">

                    <div>

                        <div class="kicker">
                            CHAPTER ${page[0]} • MEOW WORLD
                        </div>


                        <h1>
                            ${page[1]}
                        </h1>


                        <p class="quote">
                            ${page[2]}
                        </p>


                        <p class="lead">
                            ${leads[i]}
                        </p>


                        ${heroButton}

                    </div>


                    <div class="cat-panel">

                        <img
                            src="assets/cats/${page[3]}"
                            loading="eager"
                            decoding="async"
                            onerror="this.src='${fallback}'"
                        >

                    </div>

                </div>


                <section class="section">

                    <div class="kicker">
                        A LITTLE CORNER
                    </div>


                    <h2>
                        ${sectionTitles[i]}
                    </h2>


                    ${special}

                </section>


                <div class="prevrow">

                    ${
                        i > 0

                            ? `

                                <button
                                    class="secondary"
                                    onclick="prev()"
                                >

                                    ← Previous chapter

                                </button>

                            `

                            : "<span></span>"
                    }


                    ${nextButton}

                </div>

            </div>

        </section>

    `;


    /* =====================================================
       PROGRESS
    ===================================================== */

    const progress =
        document.getElementById(
            "progress"
        );


    if (progress) {

        progress.style.width =
            (
                i /
                6 *
                100
            ) + "%";

    }


    /* =====================================================
       MUSIC
    ===================================================== */

    setTrack(i);


    /* =====================================================
       CAKE
    ===================================================== */

    if (
        isCake
    ) {

        bindCandles();

    }


    /* =====================================================
       SLIDESHOW
    ===================================================== */

    if (
        page[5] > 3
    ) {

        timer =
            setInterval(
                () => {

                    if (
                        current === i
                    ) {

                        moveSlide(1);

                    }

                },
                3200
            );

    }


    /* =====================================================
       PRELOAD CURRENT + NEXT
    ===================================================== */

    preloadPageImages(i);

    preloadNextPage(i);


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    /* =====================================================
       FINAL PAGE
    ===================================================== */

    if (
        isFinal
    ) {

        startFinalPageEffect();

    }


    /* =====================================================
       OTHER PAGES
    ===================================================== */

    else {

        setTimeout(() => {

            if (
                current !== i
            ) {

                return;

            }


            pageFireworks();


            if (
                i === 0
            ) {

                playChapterOneFireworkSound();

            }

        }, 1000);

    }

}


/* =========================================================
   TRANSITION
========================================================= */

function transition(
    nextPage
) {

    if (
        busy
    ) {

        return;

    }


    busy =
        true;


    stopNormalFireworks();


    if (
        current === 6
    ) {

        stopFinalFireworksLoop();

    }


    const layer =
        document.getElementById(
            "transitionLayer"
        );


    if (!layer) {

        render(
            nextPage
        );

        busy =
            false;

        return;

    }


    layer.innerHTML =
        '<div class="trans-bg"></div>';


    if (
        current === 0
    ) {

        const pics = [

            1,
            2,
            3,
            4

        ].map(

            n =>
                path(
                    PAGES[nextPage][4],
                    Math.min(
                        n,
                        PAGES[nextPage][5]
                    )
                )

        );


        layer.innerHTML += `

            <div class="rainbow"></div>

            <div class="hangers">

                ${pics.map(
                    (src, index) => `

                    <div
                        class="hanger"
                        style="--r:${index % 2 ? "7" : "-7"}deg"
                    >

                        <div
                            class="hanger-card"
                            style="--rot:${index % 2 ? "4" : "-4"}deg"
                        >

                            <img
                                src="${src}"
                                loading="lazy"
                                decoding="async"
                                onerror="this.src='${fallback}'"
                            >

                        </div>

                    </div>

                `).join("")}

            </div>

        `;

    }


    else if (
        current === 1 ||
        current === 2
    ) {

        const pics = [

            1,
            2,
            3,
            4,
            5

        ].map(

            n =>
                path(
                    PAGES[nextPage][4],
                    Math.min(
                        n,
                        PAGES[nextPage][5]
                    )
                )

        );


        layer.innerHTML += `

            <div class="plane">
                ✈️
            </div>

            <div class="contrails">

                ${pics.map(
                    src => `

                    <div class="trail-card">

                        <img
                            src="${src}"
                            loading="lazy"
                            decoding="async"
                            onerror="this.src='${fallback}'"
                        >

                    </div>

                `).join("")}

            </div>

        `;

    }


    layer.style.display =
        "block";


    setTimeout(() => {

        render(
            nextPage
        );


        layer.style.display =
            "none";


        layer.innerHTML =
            "";


        busy =
            false;

    }, 1900);

}


/* =========================================================
   NEXT
========================================================= */

function next() {

    if (
        current <
        PAGES.length - 1
    ) {

        transition(
            current + 1
        );

    }

}


/* =========================================================
   PREVIOUS
========================================================= */

function prev() {

    if (
        current > 0
    ) {

        transition(
            current - 1
        );

    }

}


/* =========================================================
   LOGIN
========================================================= */

function login() {

    const idElement =
        document.getElementById(
            "loginId"
        );


    const passElement =
        document.getElementById(
            "loginPass"
        );


    const msg =
        document.getElementById(
            "loginMsg"
        );


    if (
        !idElement ||
        !passElement
    ) {

        return;

    }


    const id =
        idElement.value.trim();


    const password =
        passElement.value;


    if (
        id === CONFIG.id &&
        password === CONFIG.password
    ) {

        if (msg) {

            msg.textContent =
                "Access granted. Welcome home, Jaya. 🐾";

        }


        setTimeout(() => {

            const loginScreen =
                document.getElementById(
                    "loginScreen"
                );


            const app =
                document.getElementById(
                    "app"
                );


            if (
                loginScreen
            ) {

                loginScreen.classList.add(
                    "hidden"
                );

            }


            if (
                app
            ) {

                app.classList.remove(
                    "hidden"
                );

            }


            render(0);

        }, 1000);

    }


    else {

        if (msg) {

            msg.textContent =
                "You are now Meow 😾 • Try Again!";

        }

    }

}


/* =========================================================
   LOGIN BUTTON
========================================================= */

const loginBtn =
    document.getElementById(
        "loginBtn"
    );


if (
    loginBtn
) {

    loginBtn.onclick =
        login;

}


/* =========================================================
   ENTER LOGIN
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const loginScreen =
            document.getElementById(
                "loginScreen"
            );


        if (
            event.key === "Enter" &&
            loginScreen &&
            !loginScreen.classList.contains(
                "hidden"
            )
        ) {

            login();

        }

    }
);


/* =========================================================
   PLAY / PAUSE
========================================================= */

const playTrack =
    document.getElementById(
        "playTrack"
    );


if (
    playTrack
) {

    playTrack.onclick =
        () => {

            if (!audio) {
                return;
            }


            if (
                audio.paused
            ) {

                audio
                    .play()
                    .catch(
                        () => {}
                    );

            }

            else {

                audio.pause();

            }

        };

}


/* =========================================================
   NEXT MUSIC
========================================================= */

const nextTrack =
    document.getElementById(
        "nextTrack"
    );


if (
    nextTrack
) {

    nextTrack.onclick =
        () => {

            setTrack(
                (
                    track +
                    1
                ) % 7
            );

        };

}


/* =========================================================
   PREVIOUS MUSIC
========================================================= */

const prevTrack =
    document.getElementById(
        "prevTrack"
    );


if (
    prevTrack
) {

    prevTrack.onclick =
        () => {

            setTrack(
                (
                    track +
                    6
                ) % 7
            );

        };

}


/* =========================================================
   VOLUME
========================================================= */

const volume =
    document.getElementById(
        "volume"
    );


if (
    volume
) {

    volume.oninput =
        event => {

            if (
                audio
            ) {

                audio.volume =
                    +event.target.value;

            }

        };

}


/* =========================================================
   RESIZE
========================================================= */

let resizeTimeout =
    null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimeout
        );


        resizeTimeout =
            setTimeout(
                () => {

                    resizeCanvas();

                },
                150
            );

    },
    {
        passive: true
    }
);


/* =========================================================
   FLOATING EFFECTS
========================================================= */

floats();


/* =========================================================
   INITIAL CANVAS
========================================================= */

resizeCanvas();


/* =========================================================
   INITIAL PAGE PRELOAD
========================================================= */

preloadPageImages(0);


/* =========================================================
   END
========================================================= */
