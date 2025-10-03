// script.js
document.addEventListener("DOMContentLoaded", () => {
  const lines = Array.from(document.querySelectorAll(".cinema .line"));
  const foods = Array.from(document.querySelectorAll(".food"));
  const iconsWrap = document.getElementById("icons");

  // Cinematic text sequence timings
  const showTime = 1800;   // visible time
  const between = 420;     // gap between hide and next show
  async function playCinematic() {
    for (let i = 0; i < lines.length; i++) {
      const el = lines[i];
      el.classList.add("show");
      await wait(showTime);
      el.classList.remove("show");
      el.classList.add("hide");
      await wait(320);
      el.classList.remove("hide");
      await wait(between);
    }
    // After text, reveal icons
    revealIcons();
  }

  // reveal icons with pop one-by-one
  function revealIcons(){
    foods.forEach((f, i) => {
      setTimeout(()=> {
        f.classList.add("pop");
        // tiny entrance glow
        f.style.boxShadow = "0 16px 40px rgba(0,0,0,0.22), 0 0 40px rgba(255,160,120,0.08)";
        // label accessible tooltip
        f.setAttribute("tabindex","0");
        f.setAttribute("role","img");
        f.setAttribute("aria-label", f.dataset.name || "food");
        // minor jiggle after pop
        setTimeout(()=> {
          f.animate([
            { transform: "translateY(0)"},
            { transform: "translateY(-6px)"},
            { transform: "translateY(0)"}
          ], { duration: 900, easing: "cubic-bezier(.2,1,.3,1)"});
        }, 260);
      }, i * 300 + 200);
    });
  }

  // click or hover effect: tiny pulse
  foods.forEach(f => {
    f.addEventListener("mouseenter", () => {
      f.animate([{ transform: "scale(1.02)" }, { transform: "scale(1.06)" }, { transform: "scale(1.03)" }], { duration: 350, fill: "forwards" });
    });
    f.addEventListener("mouseleave", () => {
      f.animate([{ transform: "scale(1.03)" }, { transform: "scale(1.0)" }], { duration: 300, fill: "forwards" });
    });
    f.addEventListener("click", () => {
      // Tiny playful feedback: show quick subtitle near icon
      const hint = document.createElement("div");
      hint.textContent = `You chose ${f.dataset.name} ❤️`;
      hint.style.position = "absolute";
      hint.style.bottom = "-36px";
      hint.style.left = "50%";
      hint.style.transform = "translateX(-50%)";
      hint.style.fontSize = "12px";
      hint.style.padding = "6px 8px";
      hint.style.borderRadius = "8px";
      hint.style.background = "rgba(0,0,0,0.4)";
      hint.style.color = "#fff";
      hint.style.backdropFilter = "blur(4px)";
      hint.style.zIndex = 40;
      f.appendChild(hint);
      setTimeout(()=> hint.remove(), 1200);
    });
  });

  // tiny helper for waits
  function wait(ms){ return new Promise(r=> setTimeout(r, ms)); }

  // launch cinematic after small initial delay (logo/title animations run via CSS)
  setTimeout(playCinematic, 1100);

  // Floating hearts generator
  (function makeHearts(){
    const container = document.getElementById("floating-hearts");
    const colors = ["#fff6","rgba(255,180,150,0.14)","rgba(255,120,120,0.10)"];
    const max = 20;
    function spawn(){
      const h = document.createElement("div");
      h.className = "fheart";
      h.innerText = "❤️";
      const size = 12 + Math.random()*22;
      h.style.fontSize = `${size}px`;
      h.style.left = `${Math.random()*100}%`;
      h.style.bottom = `-6vh`;
      h.style.opacity = (0.5 + Math.random()*0.7).toFixed(2);
      h.style.transform = `translateY(0) scale(${0.8+Math.random()}) rotate(${Math.random()*40-20}deg)`;
      h.style.color = colors[Math.floor(Math.random()*colors.length)];
      container.appendChild(h);

      const rise = 6000 + Math.random()*9000;
      const drift = (Math.random()*40 - 20);
      h.animate([
        { transform: `translateY(0) translateX(0) scale(1)`, opacity: h.style.opacity },
        { transform: `translateY(-120vh) translateX(${drift}vw) scale(1.2)`, opacity: 0.05 }
      ], { duration: rise, easing: "linear" });

      setTimeout(()=> {
        h.remove();
      }, rise + 200);
    }

    // keep hearts around but not too many
    setInterval(()=> {
      if (container.children.length < max) spawn();
    }, 420);
  })();

  // small-accessible preference: pressing spacebar toggles icon pop animation restart
  document.addEventListener("keydown", (e)=> {
    if (e.code === "Space") {
      e.preventDefault();
      foods.forEach(f => f.classList.remove("pop"));
      setTimeout(revealIcons, 180);
    }
  });

  // Reflow visual polish on resize
  let rTO;
  window.addEventListener("resize", ()=> {
    clearTimeout(rTO);
    rTO = setTimeout(()=> {
      document.body.style.setProperty("--vw", `${window.innerWidth}px`);
    }, 100);
  });
});
