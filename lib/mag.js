// Magnetic hover for buttons and tilt for cards (spread onto a JSX element).
export const mag = {
  onPointerMove(e) {
    if (e.pointerType === "touch") return;
    const b = e.currentTarget,
      r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.14}px,${(e.clientY - r.top - r.height / 2) * 0.28 - 2}px)`;
  },
  onPointerLeave(e) {
    e.currentTarget.style.transform = "";
  },
};
export const tilt = {
  onPointerMove(e) {
    if (e.pointerType === "touch") return;
    const c = e.currentTarget,
      r = c.getBoundingClientRect();
    c.style.setProperty(
      "--ry",
      ((e.clientX - r.left) / r.width - 0.5) * 7 + "deg",
    );
    c.style.setProperty(
      "--rx",
      -((e.clientY - r.top) / r.height - 0.5) * 7 + "deg",
    );
  },
  onPointerLeave(e) {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  },
};
export const spot = {
  onPointerMove(e) {
    const c = e.currentTarget,
      r = c.getBoundingClientRect();
    c.style.setProperty("--x", e.clientX - r.left + "px");
    c.style.setProperty("--y", e.clientY - r.top + "px");
  },
};
