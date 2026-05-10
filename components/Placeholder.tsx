"use client";

import { useId } from "react";

type Props = {
  palette?: [string, string, string];
  shape?: string;
  label?: string;
  aspect?: string;
};

export function Placeholder({
  palette = ["#8a4a2a", "#d4b896", "#3a2418"],
  shape = "arch",
  label = "",
  aspect = "4/5",
}: Props) {
  const [c1, c2, c3] = palette;
  const rid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = "p" + rid;

  return (
    <div
      className="vs-ph"
      style={{
        aspectRatio: aspect,
        background: `linear-gradient(168deg, ${c2} 0%, ${c1} 60%, ${c3} 110%)`,
      }}
    >
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="vs-ph-svg">
        <defs>
          <filter id={id + "g"}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0" />
          </filter>
        </defs>
        <line x1="0" y1="340" x2="400" y2="335" stroke={c3} strokeOpacity="0.18" strokeWidth="1" />
        <path
          d="M0 340 Q 100 305 200 320 T 400 330 L 400 500 L 0 500 Z"
          fill={c3}
          fillOpacity="0.22"
        />
        <circle cx="310" cy="190" r="48" fill={c2} fillOpacity="0.45" />
        {shape === "arch" && (
          <path
            d="M120 360 L120 280 Q120 230 170 230 Q220 230 220 280 L220 360 Z M240 360 L240 300 L300 300 L300 360 Z"
            fill={c3}
            fillOpacity="0.55"
          />
        )}
        {shape === "arch-tall" && (
          <path
            d="M150 380 L150 220 Q150 165 200 165 Q250 165 250 220 L250 380 Z"
            fill={c3}
            fillOpacity="0.55"
          />
        )}
        {shape === "rect" && (
          <path
            d="M90 360 L90 290 L210 290 L210 320 L300 320 L300 360 Z M120 290 L120 260 L180 260 L180 290 Z"
            fill={c3}
            fillOpacity="0.55"
          />
        )}
        {shape === "rect-tall" && (
          <path
            d="M130 360 L130 200 L260 200 L260 360 Z"
            fill={c3}
            fillOpacity="0.55"
          />
        )}
        {shape === "circle" && (
          <g fill={c3} fillOpacity="0.55">
            <circle cx="200" cy="290" r="55" />
            <rect x="190" y="290" width="20" height="80" />
          </g>
        )}
        {shape === "circle-large" && (
          <g fill={c3} fillOpacity="0.55">
            <path d="M120 360 L120 300 Q120 240 170 240 Q220 240 220 300 L220 360 Z" />
            <path d="M230 360 L230 280 Q230 230 270 230 Q310 230 310 280 L310 360 Z" />
          </g>
        )}
        <g stroke={c3} strokeOpacity="0.32" strokeWidth="1">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1={20 + i * 60} y1="430" x2={50 + i * 60} y2="380" />
          ))}
        </g>
        <rect x="0" y="0" width="400" height="500" filter={`url(#${id}g)`} />
      </svg>
      {label && <span className="vs-ph-label">{label}</span>}
    </div>
  );
}
