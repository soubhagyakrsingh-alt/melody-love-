(() => {
  const audio = document.getElementById("love-song");
  const button = document.querySelector(".play-toggle");
  const hint = document.querySelector(".music-hint");
  if (!audio || !button) return;

  // Keep the song position when moving between the three pages.
  const savedTime = Number(sessionStorage.getItem("melodySongTime") || 0);
  const wasPlaying = sessionStorage.getItem("melodySongPlaying") === "yes";
  audio.addEventListener("loadedmetadata", () => {
    if (savedTime > 0 && Number.isFinite(audio.duration)) {
      audio.currentTime = Math.min(savedTime, Math.max(0, audio.duration - 1));
    }
    if (wasPlaying) audio.play().catch(() => {
      button.textContent = "▶";
      if (hint) hint.textContent = "Tap to play";
    });
  });
  const updateButton = () => { button.textContent = audio.paused ? "▶" : "Ⅱ"; };
  button.addEventListener("click", async () => {
    if (audio.paused) {
      try { await audio.play(); sessionStorage.setItem("melodySongPlaying", "yes"); }
      catch (_) { if (hint) hint.textContent = "Add song.mp3"; }
    } else {
      audio.pause();
      sessionStorage.setItem("melodySongPlaying", "no");
    }
    updateButton();
  });
  audio.addEventListener("play", updateButton);
  audio.addEventListener("pause", updateButton);
  window.addEventListener("pagehide", () => {
    sessionStorage.setItem("melodySongTime", String(audio.currentTime || 0));
    sessionStorage.setItem("melodySongPlaying", audio.paused ? "no" : "yes");
  });
  if (hint) {
    audio.addEventListener("error", () => { hint.textContent = "Add song.mp3"; });
    audio.addEventListener("canplay", () => { hint.textContent = "Ready to play"; });
  }
})();