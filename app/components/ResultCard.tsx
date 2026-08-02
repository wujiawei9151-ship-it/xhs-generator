"use client";

import { useState } from "react";
import type { GenerateResult } from "@/lib/types";

export default function ResultCard({ result }: { result: GenerateResult }) {
  const [copied, setCopied] = useState(false);
  const [activeTitle, setActiveTitle] = useState(0);

  const fullText = [
    "【标题候选】",
    ...result.titles.map((t, i) => `${i + 1}. ${t}`),
    "",
    "【正文】",
    result.body,
    "",
    "【推荐标签】",
    result.tags.map((t) => `#${t}`).join(" "),
  ].join("\n");

  async function handleCopyAll() {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 兜底：部分环境 clipboard API 不可用
      const ta = document.createElement("textarea");
      ta.value = fullText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="animate-fade-up rounded-xhs border border-xhs-rose bg-white p-5 shadow-xhs sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-xhs-ink sm:text-xl">
          ✨ 生成结果
        </h3>
        <button
          onClick={handleCopyAll}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-xhs-button px-4 py-2 text-sm font-semibold text-white shadow-xhs-sm transition-transform hover:scale-105 active:scale-95"
        >
          {copied ? "✅ 已复制" : "📋 一键复制全部"}
        </button>
      </div>

      {/* 标题候选 */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-xhs-plum/70">
          吸睛标题（点击切换预览）
        </p>
        <div className="flex flex-col gap-2">
          {result.titles.map((title, i) => (
            <button
              key={i}
              onClick={() => setActiveTitle(i)}
              className={[
                "rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors",
                activeTitle === i
                  ? "border-xhs-pink bg-xhs-rose text-xhs-ink"
                  : "border-xhs-rose/80 bg-xhs-cream text-xhs-plum hover:bg-xhs-rose/40",
              ].join(" ")}
            >
              <span className="mr-2 text-xhs-red">{i + 1}.</span>
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* 小红书笔记卡片预览 */}
      <div className="mb-5 rounded-2xl border border-xhs-rose bg-xhs-card p-4 sm:p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-xhs-plum/70">
          正文预览
        </p>
        <p className="mb-3 font-display text-base font-bold text-xhs-ink">
          {result.titles[activeTitle]}
        </p>
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-xhs-ink/90">
          {result.body}
        </div>
      </div>

      {/* 标签 */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-xhs-plum/70">
          推荐话题标签
        </p>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-xhs-rose px-3 py-1 text-sm font-medium text-xhs-red"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
