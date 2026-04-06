"use client";

import { useEffect } from "react";

export default function OverflowDebugger() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const enabled =
      params.get("debug") === "overflow" ||
      window.localStorage.getItem("debugOverflow") === "1";

    if (!enabled) return;

    const overlays: HTMLDivElement[] = [];

    const removeOverlays = () => {
      overlays.forEach((o) => o.remove());
      overlays.length = 0;
    };

    const scan = () => {
      removeOverlays();

      const found: HTMLElement[] = [];
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const elements = Array.from(document.querySelectorAll("body *")) as HTMLElement[];

      for (const el of elements) {
        if (el === document.body || el === document.documentElement) continue;
        if (!el.offsetWidth || !el.offsetHeight) continue;
        try {
          const rect = el.getBoundingClientRect();
          // detect overflow by scrollWidth > clientWidth (content overflow)
          const contentOverflow = el.scrollWidth > el.clientWidth + 1;
          // detect elements wider than the viewport (rect width or right edge outside viewport)
          const outOfViewport = rect.width > viewportWidth || rect.right > viewportWidth || rect.left < 0;

          if (contentOverflow || outOfViewport) {
            found.push(el);

            const o = document.createElement("div");
            o.style.position = "fixed";
            // clamp overlay coordinates to viewport so debug overlay remains visible
            const left = Math.max(0, Math.min(rect.left, viewportWidth - 4));
            const top = Math.max(0, rect.top);
            const width = Math.min(rect.width, viewportWidth);
            const height = Math.max(2, rect.height);
            o.style.left = `${left}px`;
            o.style.top = `${top}px`;
            o.style.width = `${width}px`;
            o.style.height = `${height}px`;
            o.style.border = "3px solid rgba(255,0,0,0.95)";
            o.style.background = "rgba(255,0,0,0.06)";
            o.style.zIndex = "2147483647";
            o.style.pointerEvents = "none";
            o.className = "overflow-debug-overlay";
            document.body.appendChild(o);
            overlays.push(o);
          }
        } catch (e) {
          // ignore read errors on certain elements
        }
      }

      // render a small listing panel in the corner with the offending elements
      const panelId = "overflow-debug-panel";
      let panel = document.getElementById(panelId) as HTMLDivElement | null;
      if (panel) panel.remove();
      panel = document.createElement("div");
      panel.id = panelId;
      panel.style.position = "fixed";
      panel.style.right = "12px";
      panel.style.top = "12px";
      panel.style.maxHeight = "60vh";
      panel.style.overflow = "auto";
      panel.style.zIndex = "2147483647";
      panel.style.background = "rgba(0,0,0,0.8)";
      panel.style.color = "white";
      panel.style.padding = "8px";
      panel.style.fontSize = "12px";
      panel.style.borderRadius = "8px";
      panel.style.boxShadow = "0 6px 20px rgba(0,0,0,0.6)";

      const title = document.createElement("div");
      title.style.fontWeight = "700";
      title.style.marginBottom = "6px";
      title.textContent = `Overflow Debug — ${found.length} issue(s)`;
      panel.appendChild(title);

      found.slice(0, 30).forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const item = document.createElement("div");
        item.style.marginBottom = "6px";
        item.style.cursor = "pointer";
        const selector = el.id ? `#${el.id}` : (el.className ? `.${(el.className as string).toString().split(" ")[0]}` : el.tagName.toLowerCase());
        item.textContent = `${i + 1}. ${selector} — rect:${Math.round(r.width)}px x ${Math.round(r.height)}px, left:${Math.round(r.left)}, right:${Math.round(r.right)}, scroll:${el.scrollWidth}px, client:${el.clientWidth}px`;
        item.onclick = () => {
          window.scrollTo({ top: Math.max(0, r.top - 80), behavior: "smooth" });
          // flash the element
          el.style.transition = "box-shadow 150ms";
          el.style.boxShadow = "0 0 0 3px rgba(255,200,200,0.9)";
          setTimeout(() => {
            el.style.boxShadow = "";
          }, 600);
        };
        panel!.appendChild(item);
      });

      if (found.length) document.body.appendChild(panel);

      // log a concise report to console
      if (found.length) {
        console.group("OverflowDebugger: found overflowing elements (%d)", found.length);
        found.forEach((el, i) => {
          console.log(i + 1, el, { rect: el.getBoundingClientRect(), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth });
        });
        console.groupEnd();
      } else {
        console.log("OverflowDebugger: no overflowing elements found");
      }
    };

    // initial scan
    scan();

    const resizeHandler = () => scan();
    window.addEventListener("resize", resizeHandler);
    window.addEventListener("orientationchange", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("orientationchange", resizeHandler);
      removeOverlays();
    };
  }, []);

  // small control to enable persistent debug mode
  return (
    <div className="fixed bottom-4 right-4 z-[999999999]">
      <button
        onClick={() => {
          window.localStorage.setItem("debugOverflow", "1");
          window.location.reload();
        }}
        className="rounded bg-red-600 px-3 py-2 text-white text-xs shadow-lg"
        title="Enable overflow debug and reload"
      >
        Enable overflow debug
      </button>
    </div>
  );
}
