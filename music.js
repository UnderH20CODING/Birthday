/* music.js — shared 8-bit background music loop, loaded on every page.
   Fully synthesized (Web Audio oscillators), no external audio files.
   Browsers block audio until a user gesture, so playback starts on the
   first click/keydown/touch anywhere on the page. Mute state persists
   across pages via localStorage. */

(function () {
  const NOTE_FREQS = {
    A3: 220.0, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
  };

  // [note, duration in seconds]
  const MELODY = [
    ["A3", 0.2], ["C4", 0.2], ["E4", 0.2], ["A4", 0.2],
    ["G4", 0.2], ["E4", 0.2], ["C4", 0.2], ["A3", 0.2],
    ["A3", 0.2], ["D4", 0.2], ["A4", 0.2], ["G4", 0.2],
    ["E4", 0.2], ["D4", 0.2], ["C4", 0.2], ["A3", 0.4],
  ];
  const LOOP_SECONDS = MELODY.reduce((sum, [, d]) => sum + d, 0);

  let ctx = null;
  let started = false;
  let muted = localStorage.getItem("muteMusic") === "1";
  let loopTimer = null;

  function playNote(freq, startTime, duration, type, gainPeak) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  function scheduleLoop() {
    if (!muted) {
      let t = ctx.currentTime + 0.05;
      for (const [note, dur] of MELODY) {
        playNote(NOTE_FREQS[note], t, dur * 0.9, "square", 0.045);
        playNote(NOTE_FREQS[note] / 2, t, dur * 0.9, "triangle", 0.035);
        t += dur;
      }
    }
    loopTimer = setTimeout(scheduleLoop, LOOP_SECONDS * 1000 - 40);
  }

  function start() {
    if (started) return;
    started = true;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    scheduleLoop();
  }

  function updateButton() {
    const btn = document.getElementById("music-toggle");
    if (btn) btn.textContent = muted ? "\u{1F507}" : "\u{1F50A}";
  }

  function toggleMute() {
    muted = !muted;
    localStorage.setItem("muteMusic", muted ? "1" : "0");
    updateButton();
  }

  function init() {
    const btn = document.createElement("button");
    btn.id = "music-toggle";
    btn.className = "music-toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle music");
    btn.textContent = muted ? "\u{1F507}" : "\u{1F50A}";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!started) start();
      toggleMute();
    });
    document.body.appendChild(btn);

    const startOnce = () => {
      start();
      document.removeEventListener("click", startOnce);
      document.removeEventListener("keydown", startOnce);
      document.removeEventListener("touchstart", startOnce);
    };
    document.addEventListener("click", startOnce);
    document.addEventListener("keydown", startOnce);
    document.addEventListener("touchstart", startOnce);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
