/* =========================================================
   MEOW WORLD — COMPLETE SCRIPT
   ========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {

    id: "1",

    password: "1",

    name: "Jaya",

    nicknames: [
        "MERA BACHUU",
        "SHONIII",
        "MISS RAIKWAR JI"
    ],

    message:
        "MERA BACHUU, SHONIII, MISS RAIKWAR JI — tumhari smile aur tumhari presence meri favourite memories ka sabse beautiful part hai. Aaj ka din tumhara hai, aur ye little Meow World sirf tumhare liye. Happy Birthday, my love. Meowww 🐾💗",

    music: [1,2,3,4,5,6,7].map(
        n => `assets/music/song-${String(n).padStart(2,"0")}.mp3`
    ),

    backgrounds: [1,2,3,4,5,6,7].map(
        n => `assets/backgrounds/bg-${String(n).padStart(2,"0")}.jpg`
    ),

    FIREWORK_SOUND:
        "assets/music/Fireworks.mp3"
};


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
   GLOBAL VARIABLES
========================================================= */

let current = 0;
let track = 0;
let slide = 0;
let timer = null;
let busy = false;
let fireworkRun = null;

let fireworkAudio = null;
let loginFireworkAudio = null;


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
   FIREWORK AUDIO OBJECT
========================================================= */

function createFireworkAudio() {

    if (!fireworkAudio) {

        fireworkAudio =
            new Audio(CONFIG.FIREWORK_SOUND);

        fireworkAudio.preload = "auto";

        fireworkAudio.volume = 0.85;
    }

    return fireworkAudio;
}


function createLoginFireworkAudio() {

    if (!loginFireworkAudio) {

        loginFireworkAudio =
            new Audio(CONFIG.FIREWORK_SOUND);

        loginFireworkAudio.preload = "auto";
        loginFireworkAudio.volume = 0.85;
    }

    return loginFireworkAudio;

}

/* =========================================================
   PLAY FIREWORK SOUND
   Used ONLY where explicitly called.
========================================================= */

function playFireworkSound(duration = 2000) {

    const sound =
        createFireworkAudio();

    try {

        sound.pause();

        sound.currentTime = 0;

        const playPromise =
            sound.play();

        if (playPromise) {

            playPromise.catch(error => {

                console.log(
                    "Firework audio autoplay/play error:",
                    error
                );

            });

        }

        setTimeout(() => {

            try {

                sound.pause();

                sound.currentTime = 0;

            }

            catch (e) {}

        }, duration);

    }

    catch (e) {

        console.log(
            "Firework sound error:",
            e
        );

    }

}


/* =========================================================
   LOGIN FIREWORK SOUND
   IMPORTANT:
   LOGIN SUCCESS
   ↓
   WAIT 1 SECOND
   ↓
   PLAY FIREWORK SOUND
   ↓
   STOP AFTER 5 SECONDS
========================================================= */

function playLoginFireworkSound() {

    const sound = createLoginFireworkAudio();

    /*
       Browser audio policy can reject a delayed play().
       We unlock the audio element during the login click,
       keep it silent, then start the real sound after 1 sec.
    */
    try {
        sound.pause();
        sound.currentTime = 0;
        sound.volume = 0;
        sound.muted = true;

        const unlock = sound.play();

        if (unlock && unlock.catch) {
            unlock.catch(error => {
                console.log("Audio unlock error:", error);
            });
        }
    } catch (e) {
        console.log("Audio unlock error:", e);
    }

    setTimeout(() => {
        try {
            sound.pause();
            sound.currentTime = 0;
            sound.muted = false;
            sound.volume = 0.85;

            const promise = sound.play();

            if (promise && promise.catch) {
                promise.catch(error => {
                    console.log("Login firework sound blocked:", error);
                });
            }

            /* Play for exactly 5 seconds. */
            setTimeout(() => {
                try {
                    sound.pause();
                    sound.currentTime = 0;
                } catch (e) {}
            }, 5000);

        } catch (e) {
            console.log("Login firework sound error:", e);
        }
    }, 1000);
}


/* =========================================================
   PATH HELPER
========================================================= */

function path(folder, n) {

    return `assets/images/${folder}/image-${String(n).padStart(2,"0")}.jpg`;

}


/* =========================================================
   FLOATING DECORATIONS
========================================================= */

function floats() {

    const layer =
        document.getElementById("floatLayer");

    if (!layer) return;


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


    setInterval(() => {

        const e =
            document.createElement("span");

        e.className =
            "floater";

        e.textContent =
            chars[
                Math.floor(
                    Math.random() * chars.length
                )
            ];

        e.style.left =
            Math.random() * 100 + "vw";

        e.style.fontSize =
            12 + Math.random() * 22 + "px";

        e.style.setProperty(
            "--dx",
            (Math.random() - 0.5) * 35 + "vw"
        );

        e.style.setProperty(
            "--rot",
            (Math.random() - 0.5) * 240 + "deg"
        );

        e.style.animationDuration =
            8 + Math.random() * 8 + "s";

        layer.appendChild(e);

        setTimeout(
            () => e.remove(),
            17000
        );

    }, 650);

}


/* =========================================================
   CANVAS RESIZE
========================================================= */

function resizeCanvas() {

    const c =
        document.getElementById("fireworks");

    if (!c) return;

    const d =
        window.devicePixelRatio || 1;

    c.width =
        innerWidth * d;

    c.height =
        innerHeight * d;

    const ctx =
        c.getContext("2d");

    ctx.setTransform(
        d,
        0,
        0,
        d,
        0,
        0
    );

}


/* =========================================================
   MAKE BURST
========================================================= */

function makeBurst(
    x,
    y,
    count = 145
) {

    const palette = [

        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360

    ];


    return Array.from(
        { length: count },
        (_, i) => {

            const a =
                Math.PI * 2 * i / count +
                Math.random() * 0.12;

            const s =
                2.4 +
                Math.random() * 6.2;

            return {

                x,
                y,

                vx:
                    Math.cos(a) * s,

                vy:
                    Math.sin(a) * s,

                life: 1,

                size:
                    1 +
                    Math.random() * 2.4,

                hue:
                    palette[
                        i % palette.length
                    ] +
                    Math.random() * 26

            };

        }
    );

}


/* =========================================================
   SINGLE BURST
========================================================= */

function burst(
    x,
    y,
    count = 145
) {

    fireworks(
        900,
        {
            x,
            y,
            count
        }
    );

}


/* =========================================================
   FIREWORK ENGINE
========================================================= */

function fireworks(
    duration = 2000,
    instantBurst = null
) {

    const c =
        document.getElementById("fireworks");

    if (!c) return;


    const ctx =
        c.getContext("2d");

    resizeCanvas();


    if (fireworkRun) {

        fireworkRun.stop = true;

    }


    const run = {

        stop: false,

        until:
            performance.now() +
            duration,

        rocket: null,

        bursts:
            instantBurst
                ? makeBurst(
                    instantBurst.x,
                    instantBurst.y,
                    instantBurst.count
                )
                : [],

        flash:
            instantBurst
                ? 1
                : 0

    };


    fireworkRun = run;


    function launchRocket() {

        const x =
            innerWidth *
            (
                0.16 +
                Math.random() * 0.68
            );

        const target =
            innerHeight *
            (
                0.14 +
                Math.random() * 0.28
            );

        run.rocket = {

            x,

            y:
                innerHeight + 36,

            vx:
                (Math.random() - 0.5) * 1.1,

            vy:
                -8.4 -
                Math.random() * 1.4,

            target,

            trail: []

        };

    }


    function step(now) {

        if (run.stop) return;


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


        if (run.flash > 0) {

            ctx.fillStyle =
                `rgba(255,245,255,${run.flash * 0.12})`;

            ctx.fillRect(
                0,
                0,
                innerWidth,
                innerHeight
            );

            run.flash -= 0.08;

        }


        /* ROCKET */

        if (run.rocket) {

            const r =
                run.rocket;


            r.trail.push({
                x: r.x,
                y: r.y
            });


            if (
                r.trail.length > 18
            ) {

                r.trail.shift();

            }


            r.trail.forEach(
                (p, i) => {

                    ctx.beginPath();

                    ctx.arc(
                        p.x,
                        p.y,
                        Math.max(
                            1,
                            3 - i * 0.13
                        ),
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        `rgba(
                            255,
                            230,
                            170,
                            ${i / r.trail.length * 0.75}
                        )`;

                    ctx.fill();

                }
            );


            r.x += r.vx;

            r.y += r.vy;

            r.vy += 0.045;


            if (
                r.y <= r.target
            ) {

                run.bursts.push(
                    ...makeBurst(
                        r.x,
                        r.y
                    )
                );

                run.flash = 1;

                run.rocket = null;

            }

        }


        /* PARTICLES */

        run.bursts =
            run.bursts.filter(
                p =>
                    p.life > 0
            );


        run.bursts.forEach(
            p => {

                p.x += p.vx;

                p.y += p.vy;

                p.vy += 0.055;

                p.vx *= 0.992;

                p.vy *= 0.992;

                p.life -= 0.009;

                p.size *= 0.998;


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
                        ${62 + Math.random() * 24}%,
                        ${Math.max(0, p.life)}
                    )`;

                ctx.fill();

            }
        );


        if (
            now < run.until ||
            run.rocket ||
            run.bursts.length
        ) {

            requestAnimationFrame(step);

        }

        else {

            ctx.clearRect(
                0,
                0,
                innerWidth,
                innerHeight
            );


            if (
                fireworkRun === run
            ) {

                fireworkRun = null;

            }

        }

    }


    requestAnimationFrame(step);

}


/* =========================================================
   PAGE FIREWORKS
   VISUAL ONLY
   NO SOUND
========================================================= */

function pageFireworks() {

    fireworks(2000);

}


/* =========================================================
   TRANSITION
========================================================= */

function transition(nextPage) {

    if (busy) return;

    busy = true;


    const layer =
        document.getElementById(
            "transitionLayer"
        );


    if (!layer) {

        render(nextPage);

        busy = false;

        return;

    }


    layer.innerHTML =
        '<div class="trans-bg"></div>';


    if (current === 0) {

        const pics = [
            1,
            2,
            3,
            4
        ].map(
            n =>
                path(
                    PAGES[nextPage][4],
                    n
                )
        );


        layer.innerHTML += `

            <div class="rainbow"></div>

            <div class="hangers">

                ${pics.map(
                    (s, i) => `

                    <div
                        class="hanger"
                        style="--r:${i % 2 ? "7" : "-7"}deg"
                    >

                        <div
                            class="hanger-card"
                            style="--rot:${i % 2 ? "4" : "-4"}deg"
                        >

                            <img
                                src="${s}"
                                onerror="this.src='${fallback}'"
                            >

                        </div>

                    </div>

                `
                ).join("")}

            </div>

        `;

    }

    else {

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
                    s => `

                    <div class="trail-card">

                        <img
                            src="${s}"
                            onerror="this.src='${fallback}'"
                        >

                    </div>

                `
                ).join("")}

            </div>

        `;

    }


    layer.style.display =
        "block";


    fireworks(1900);


    setTimeout(() => {

        render(nextPage);

        layer.style.display =
            "none";

        layer.innerHTML =
            "";

        busy = false;

    }, 1900);

}


/* =========================================================
   SLIDESHOW
========================================================= */

function slidesMarkup(
    folder,
    count
) {

    const total =
        Math.max(1, count);

    const shown =
        Math.min(3, total);


    return `

        <div class="square-showcase">

            ${Array.from(
                { length: shown },
                (_, j) => `

                    <div class="square-slide">

                        <img
                            id="slide${j}"
                            src="${path(folder, j + 1)}"
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

function moveSlide(dir) {

    const p =
        PAGES[current];

    if (!p) return;


    const folder =
        p[4];

    const count =
        p[5];


    if (count <= 3) return;


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

        const im =
            document.getElementById(
                "slide" + j
            );


        if (im) {

            const idx =
                (slide + j) % count;


            im.style.opacity = 0;


            setTimeout(() => {

                im.src =
                    path(
                        folder,
                        idx + 1
                    );

                im.style.opacity = 1;

            }, 220);

        }

    }


    const dots =
        document.getElementById(
            "dots"
        );


    if (dots) {

        dots.textContent =
            `${String(slide + 1).padStart(2,"0")} / ${count}`;

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
                            { length: 9 },
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
        .forEach(c => {

            c.onclick = () => {

                if (
                    c.classList.contains("off")
                ) {

                    return;

                }


                c.classList.add("off");


                burst(

                    innerWidth *
                    (
                        0.25 +
                        Math.random() * 0.5
                    ),

                    innerHeight * 0.25,

                    100

                );


                const remaining =
                    document.querySelectorAll(
                        ".candle:not(.off)"
                    ).length;


                if (
                    remaining === 0
                ) {

                    setTimeout(() => {

                        const letter =
                            document.getElementById(
                                "letter"
                            );


                        if (letter) {

                            letter.classList.add(
                                "show"
                            );

                        }


                        fireworks(1500);

                    }, 650);

                }

            };

        });

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


                <button
                    class="primary"
                    onclick="startFinalFireworks()"
                >

                    Fireworks for you 🎆

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   FINAL FIREWORKS
   COMPLETE AUDIO
========================================================= */

function startFinalFireworks() {

    const sound =
        createFireworkAudio();


    try {

        sound.pause();

        sound.currentTime = 0;

        sound.volume = 0.85;

    }

    catch (e) {}


    fireworks(5000);


    try {

        const promise =
            sound.play();

        if (promise) {

            promise.catch(error => {

                console.log(
                    "Final fireworks audio error:",
                    error
                );

            });

        }

    }

    catch (e) {

        console.log(
            "Final firework sound error:",
            e
        );

    }

}


/* =========================================================
   MUSIC
========================================================= */

function setTrack(i) {

    track = i;


    if (!audio) return;


    audio.pause();

    audio.currentTime = 0;


    audio.src =
        CONFIG.music[i];


    audio.loop = true;


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
            `Chapter ${String(i + 1).padStart(2,"0")}`;

    }


    audio.play().catch(
        () => {}
    );

}


/* =========================================================
   RENDER
========================================================= */

function render(i) {

    if (
        i < 0 ||
        i >= PAGES.length
    ) {

        return;

    }


    current = i;

    slide = 0;

    clearInterval(timer);


    const p =
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

    else if (i === 4) {

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
                p[4],
                p[5]
            );

    }


    let heroButton =
        "";


    if (isFinal) {

        heroButton = `

            <button
                class="primary"
                onclick="startFinalFireworks()"
            >

                Fireworks for you 🎆

            </button>

        `;

    }

    else if (!isCake) {

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
        i < 6 && !isCake

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
                            CHAPTER ${p[0]} • MEOW WORLD
                        </div>


                        <h1>
                            ${p[1]}
                        </h1>


                        <p class="quote">
                            ${p[2]}
                        </p>


                        <p class="lead">
                            ${leads[i]}
                        </p>


                        ${heroButton}

                    </div>


                    <div class="cat-panel">

                        <img
                            src="assets/cats/${p[3]}"
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


    const progress =
        document.getElementById(
            "progress"
        );


    if (progress) {

        progress.style.width =
            (i / 6 * 100) + "%";

    }


    setTrack(i);


    if (isCake) {

        bindCandles();

    }


    if (
        p[5] > 3
    ) {

        timer =
            setInterval(
                () => moveSlide(1),
                3200
            );

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    /* VISUAL FIREWORKS ONLY */

    setTimeout(() => {

        pageFireworks();

    }, 120);

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

    const id =
        document.getElementById(
            "loginId"
        ).value.trim();


    const pw =
        document.getElementById(
            "loginPass"
        ).value;


    const msg =
        document.getElementById(
            "loginMsg"
        );


    if (
        id === CONFIG.id &&
        pw === CONFIG.password
    ) {

        msg.textContent =
            "Access granted. Welcome home, Jaya. 🐾";


        /*
         * LOGIN SUCCESS
         *
         * Visual fireworks immediately.
         *
         * Audio:
         * 1 second delay
         * then 5 seconds
         */

        fireworks(2000);

        playLoginFireworkSound();


        setTimeout(() => {

            document
                .getElementById(
                    "loginScreen"
                )
                .classList.add(
                    "hidden"
                );


            document
                .getElementById(
                    "app"
                )
                .classList.remove(
                    "hidden"
                );


            render(0);

        }, 900);

    }

    else {

        msg.textContent =
            "You are now Meow 😾 • Try Again!";

    }

}


/* =========================================================
   LOGIN BUTTON
========================================================= */

const loginBtn =
    document.getElementById(
        "loginBtn"
    );


if (loginBtn) {

    loginBtn.onclick =
        login;

}


/* =========================================================
   ENTER KEY LOGIN
========================================================= */

document.addEventListener(
    "keydown",
    e => {

        const loginScreen =
            document.getElementById(
                "loginScreen"
            );


        if (
            e.key === "Enter" &&
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


if (playTrack) {

    playTrack.onclick = () => {

        if (
            audio.paused
        ) {

            audio.play().catch(
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


if (nextTrack) {

    nextTrack.onclick = () => {

        setTrack(
            (track + 1) % 7
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


if (prevTrack) {

    prevTrack.onclick = () => {

        setTrack(
            (track + 6) % 7
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


if (volume) {

    volume.oninput =
        e => {

            audio.volume =
                +e.target.value;

        };

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        resizeCanvas();

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