"use client";

import { CopyStyle, STYLE_OPTIONS } from "@/lib/types";

export default function StyleSelector({
  value,
  onChange,
}: {
  value: CopyStyle;
  onChange: (v: CopyStyle) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {STYLE_OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={[
              "group relative flex flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-sm transition-all",
              active
                ? "border-transparent bg-xhs-button text-white shadow-xhs-sm scale-[1.02]"
                : "border-xhs-rose bg-white text-xhs-plum hover:border-xhs-pink/50 hover:bg-xhs-rose/40",
            ].join(" ")}
          >
            <span className="text-lg leading-none">{opt.emoji}</span>
            <span className="font-semibold">{opt.label}</span>
            <span
              className={[
                "text-[11px] leading-tight",
                active ? "text-white/85" : "text-xhs-plum/60",
              ].join(" ")}
            >
              {opt.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
