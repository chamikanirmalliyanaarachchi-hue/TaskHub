/**
 * Lightweight, dependency-free confetti using the Web Animations API.
 * Fires a one-off particle burst from the top of the viewport.
 */
export function fireConfetti() {
  if (typeof document === "undefined") return;

  const colors = ["#8b5cf6", "#22d3ee", "#f43f5e", "#f59e0b", "#10b981"];
  const count = 90;

  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;";
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const size = 6 + Math.random() * 6;
    p.style.cssText = [
      "position:absolute",
      `left:${Math.random() * 100}vw`,
      "top:-24px",
      `width:${size}px`,
      `height:${size}px`,
      `background:${colors[i % colors.length]}`,
      `border-radius:${Math.random() > 0.5 ? "50%" : "2px"}`,
      "will-change:transform,opacity",
    ].join(";");
    container.appendChild(p);

    const fall = 60 + Math.random() * 45; // vh
    const drift = (Math.random() - 0.5) * 40; // vw
    const rot = Math.random() * 720 - 360;
    const anim = p.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${drift}vw, ${fall}vh) rotate(${rot}deg)`,
          opacity: 0,
        },
      ],
      { duration: 1400 + Math.random() * 900, easing: "cubic-bezier(.2,.6,.4,1)" }
    );
    anim.onfinish = () => p.remove();
  }

  setTimeout(() => container.remove(), 2600);
}
