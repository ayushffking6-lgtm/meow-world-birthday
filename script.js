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
    "MERA BACHUU, SHONIII, MISS RAIKWAR JI — tumhari smile aur tumhari presence meri favourite memories ka sabse beautiful part hai. Happy Birthday, my love. Meowww 🐾💗",

  music: [1, 2, 3, 4].map(
    n => `assets/music/song-${String(n).padStart(2, "0")}.mp3`
  ),

  backgrounds: [1, 2, 3, 4].map(
    n => `assets/backgrounds/bg-${String(n).padStart(2, "0")}.jpg`
  )
};

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
    4
  ]
];

let current = 0;
let track = 0;
let slide = 0;
let timer = null;
let busy = false;
let fireworkRun = null;

const story = document.getElementById("story");
const audio = document.getElementById("audio");
const fallback = "assets/cats/fallback-cat.jpeg";

function path(folder, n) {
  return `assets/images/${folder}/image-${String(n).padStart(2, "0")}.jpg`;
}

function floats() {
  const layer = document.getElementById("floatLayer");
  if (!layer) return;

  const chars = ["♡", "♥", "✦", "✧", "❀", "🌸", "🎀", "✿", "🐾"];

  setInterval(() => {
    const e = document.createElement("span");

    e.className = "floater";
    e.textContent = chars[Math.floor(Math.random() * chars.length)];
    e.style.left = Math.random() * 100 + "vw";
    e.style.fontSize = 12 + Math.random() * 22 + "px";
    e.style.setProperty("--dx", (Math.random() - 0.5) * 35 + "vw");
    e.style.setProperty("--rot", (Math.random() - 0.5) * 240 + "deg");
    e.style.animationDuration = 8 + Math.random() * 8 + "s";

    layer.appendChild(e);

    setTimeout(() => e.remove(), 17000);
  }, 650);
}

function resizeCanvas() {
  const c = document.getElementById("fireworks");
  if (!c) return;

  const d = window.devicePixelRatio || 1;

  c.width = innerWidth * d;
  c.height = innerHeight * d;

  const ctx = c.getContext("2d");
  ctx.setTransform(d, 0, 0, d, 0, 0);
}

function makeBurst(x, y, count = 145) {
  const palette = [
    Math.random() * 360,
    Math.random() * 360,
    Math.random() * 360,
    Math.random() * 360
  ];

  return Array.from({ length: count }, (_, i) => {
    const a = Math.PI * 2 * i / count + Math.random() * 0.12;
    const s = 2.4 + Math.random() * 6.2;

    return {
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 1,
      size: 1 + Math.random() * 2.4,
      hue: palette[i % palette.length] + Math.random() * 26
    };
  });
}

function fireworks(duration = 2000, instantBurst = null) {
  const c = document.getElementById("fireworks");
  if (!c) return;

  const ctx = c.getContext("2d");

  resizeCanvas();

  if (fireworkRun) {
    fireworkRun.stop = true;
  }

  const run = {
    stop: false,
    until: performance.now() + duration,
    rocket: null,
    bursts: instantBurst
      ? makeBurst(instantBurst.x, instantBurst.y, instantBurst.count)
      : [],
    flash: instantBurst ? 1 : 0
  };

  fireworkRun = run;

  function launchRocket() {
    const x = innerWidth * (0.16 + Math.random() * 0.68);
    const target = innerHeight * (0.14 + Math.random() * 0.28);

    run.rocket = {
      x,
      y: innerHeight + 36,
      vx: (Math.random() - 0.5) * 1.1,
      vy: -8.4 - Math.random() * 1.4,
      target,
      trail: []
    };
  }

  function step(now) {
    if (run.stop) return;

    if (!run.rocket && now < run.until) {
      launchRocket();
    }

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.globalCompositeOperation = "lighter";

    if (run.flash > 0) {
      ctx.fillStyle = `rgba(255,245,255,${run.flash * 0.12})`;
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      run.flash -= 0.08;
    }

    if (run.rocket) {
      const r = run.rocket;

      r.trail.push({ x: r.x, y: r.y });

      if (r.trail.length > 18) {
        r.trail.shift();
      }

      r.trail.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, 3 - i * 0.13), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,230,170,${i / r.trail.length * 0.75})`;
        ctx.fill();
      });

      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.045;

      if (r.y <= r.target) {
        run.bursts.push(...makeBurst(r.x, r.y));
        run.flash = 1;
        run.rocket = null;
      }
    }

    run.bursts = run.bursts.filter(p => p.life > 0);

    run.bursts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.055;
      p.vx *= 0.992;
      p.vy *= 0.992;
      p.life -= 0.009;
      p.size *= 0.998;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,${62 + Math.random() * 24}%,${Math.max(0, p.life)})`;
      ctx.fill();
    });

    if (now < run.until || run.rocket || run.bursts.length) {
      requestAnimationFrame(step);
    } else {
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      if (fireworkRun === run) {
        fireworkRun = null;
      }
    }
  }

  requestAnimationFrame(step);
}

function transition(nextPage) {
  if (busy) return;

  busy = true;

  const layer = document.getElementById("transitionLayer");

  if (!layer) {
    render(nextPage);
    busy = false;
    return;
  }

  const pics = [1, 2, 3, 4].map(n => path(PAGES[nextPage][4], n));

  layer.innerHTML = `
    <div class="trans-bg"></div>

    <div class="plane">
      ✈️
    </div>

    <div class="contrails">
      ${pics.map(s => `
        <div class="trail-card">
          <img src="${s}" onerror="this.src='${fallback}'">
        </div>
      `).join("")}
    </div>
  `;

  layer.style.display = "block";

  fireworks(1900);

  setTimeout(() => {
    render(nextPage);

    layer.style.display = "none";
    layer.innerHTML = "";
    busy = false;
  }, 1900);
}

function slidesMarkup(folder, count) {
  const total = Math.max(1, count);
  const shown = Math.min(3, total);

  return `
    <div class="square-showcase">
      ${Array.from({ length: shown }, (_, j) => `
        <div class="square-slide">
          <img
            id="slide${j}"
            src="${path(folder, j + 1)}"
            onerror="this.src='${fallback}'"
          >

          <div class="caption" id="cap${j}">
            ${["MERA BACHUU 💗", "SHONIII ✨", "MISS RAIKWAR JI 🌸"][j]}
          </div>
        </div>
      `).join("")}
    </div>

    <div class="controls">
      <button onclick="moveSlide(-1)">←</button>
      <span id="dots">01 / ${total}</span>
      <button onclick="moveSlide(1)">→</button>
    </div>
  `;
}

function moveSlide(dir) {
  const p = PAGES[current];
  const folder = p[4];
  const count = p[5];

  if (count <= 3) return;

  slide = (slide + dir + count) % count;

  for (let j = 0; j < 3; j++) {
    const im = document.getElementById("slide" + j);

    if (im) {
      const idx = (slide + j) % count;

      im.style.opacity = 0;

      setTimeout(() => {
        im.src = path(folder, idx + 1);
        im.style.opacity = 1;
      }, 220);
    }
  }

  const dots = document.getElementById("dots");

  if (dots) {
    dots.textContent = `${String(slide + 1).padStart(2, "0")} / ${count}`;
  }
}

function setTrack(i) {
  track = i;

  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;

  audio.src = CONFIG.music[i];
  audio.loop = true;

  const volume = document.getElementById("volume");

  if (volume) {
    audio.volume = +volume.value;
  }

  const trackName = document.getElementById("trackName");

  if (trackName) {
    trackName.textContent = `Chapter ${String(i + 1).padStart(2, "0")}`;
  }

  audio.play().catch(() => {});
}

function render(i) {
  if (i < 0 || i >= PAGES.length) return;

  current = i;
  slide = 0;

  clearInterval(timer);

  const p = PAGES[i];

  const leads = [
    `Aaj se ye little world tumhara hai. Bas explore karte jaana — surprise ko rush nahi karna.`,
    `Har photo ko square frame mein rakha hai, taaki memory ko wide crop na karna pade.`,
    `Kuch moments loud hote hain, kuch quietly favourite ban jaate hain.`,
    `Humare game screenshots — because kuch fights screen par hoti hain aur kuch sirf hasi ke liye.`
  ];

  const sectionTitles = [
    "The first little reveal.",
    "Her, in little frames.",
    "Us, one square at a time.",
    "Game moments."
  ];

  const heroButton =
    i < PAGES.length - 1
      ? `<button class="primary" onclick="next()">Next chapter →</button>`
      : `<button class="primary" onclick="fireworks(3000)">Celebrate ✨</button>`;

  const nextButton =
    i < PAGES.length - 1
      ? `<button class="secondary" onclick="next()">Next →</button>`
      : "";

  story.innerHTML = `
    <section class="page" style="background-image:url('${CONFIG.backgrounds[i]}')">
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

          ${slidesMarkup(p[4], p[5])}
        </section>

        <div class="prevrow">
          ${
            i > 0
              ? `<button class="secondary" onclick="prev()">← Previous chapter</button>`
              : `<span></span>`
          }

          ${nextButton}
        </div>
      </div>
    </section>
  `;

  const progress = document.getElementById("progress");

  if (progress) {
    progress.style.width = (i / (PAGES.length - 1) * 100) + "%";
  }

  setTrack(i);

  if (p[5] > 3) {
    timer = setInterval(() => moveSlide(1), 3200);
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  setTimeout(() => {
    fireworks(1500);
  }, 120);
}

function next() {
  if (current < PAGES.length - 1) {
    transition(current + 1);
  }
}

function prev() {
  if (current > 0) {
    transition(current - 1);
  }
}

function login() {
  const id = document.getElementById("loginId").value.trim();
  const pw = document.getElementById("loginPass").value;
  const msg = document.getElementById("loginMsg");

  if (id === CONFIG.id && pw === CONFIG.password) {
    msg.textContent = "Access granted. Welcome home, Jaya. 🐾";

    fireworks(2000);

    setTimeout(() => {
      document.getElementById("loginScreen").classList.add("hidden");
      document.getElementById("app").classList.remove("hidden");

      render(0);
    }, 900);
  } else {
    msg.textContent = "You are now Meow 😾 • Try Again!";
  }
}

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.onclick = login;
}

document.addEventListener("keydown", e => {
  const loginScreen = document.getElementById("loginScreen");

  if (
    e.key === "Enter" &&
    loginScreen &&
    !loginScreen.classList.contains("hidden")
  ) {
    login();
  }
});

const playTrack = document.getElementById("playTrack");

if (playTrack) {
  playTrack.onclick = () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };
}

const nextTrack = document.getElementById("nextTrack");

if (nextTrack) {
  nextTrack.onclick = () => {
    setTrack((track + 1) % CONFIG.music.length);
  };
}

const prevTrack = document.getElementById("prevTrack");

if (prevTrack) {
  prevTrack.onclick = () => {
    setTrack((track + CONFIG.music.length - 1) % CONFIG.music.length);
  };
}

const volume = document.getElementById("volume");

if (volume) {
  volume.oninput = e => {
    audio.volume = +e.target.value;
  };
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

floats();
resizeCanvas();
