"use client";

import { useEffect, useState } from "react";
import type { CopyStyle, GenerateResponse, GenerateResult } from "@/lib/types";
import { DAILY_FREE_LIMIT, canGenerate, consumeUse, getRemainingUses } from "@/lib/usage";
import StyleSelector from "./StyleSelector";
import ResultCard from "./ResultCard";

export default function GeneratorForm() {
  const [topic, setTopic] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState<CopyStyle>("种草");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    // 仅在客户端挂载后读取，避免 SSR/CSR 不一致
    setRemaining(getRemainingUses());
  }, []);

  async function handleGenerate() {
    setError(null);

    if (!topic.trim()) {
      setError("请先填写产品名称或主题～");
      return;
    }

    if (!canGenerate()) {
      setError(`今日免费次数已用完（每天 ${DAILY_FREE_LIMIT} 次），加微信解锁无限生成～`);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, sellingPoints, audience, style }),
      });
      const data = (await res.json()) as GenerateResponse;

      if (!res.ok || !data.success || !data.data) {
        setError(data.error || "生成失败，请稍后重试");
        return;
      }

      setResult(data.data);
      const left = consumeUse();
      setRemaining(left);
    } catch {
      setError("网络异常，请检查网络连接后重试");
    } finally {
      setLoading(false);
    }
  }

  const remainingKnown = remaining !== null;
  const exhausted = remainingKnown && remaining! <= 0;

  return (
    <section className="mx-auto w-full max-w-2xl px-4">
      <div className="rounded-xhs border border-xhs-rose bg-white/80 p-5 shadow-xhs backdrop-blur sm:p-8">
        {/* 剩余次数徽章 */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-xhs-ink sm:text-2xl">
            填写笔记信息
          </h2>
          {remainingKnown && (
            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold",
                exhausted
                  ? "bg-red-100 text-red-500"
                  : "bg-xhs-rose text-xhs-red",
              ].join(" ")}
            >
              今日剩余 {remaining} / {DAILY_FREE_LIMIT} 次
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Field label="产品名称 / 主题" required>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：小众氨基酸洗发水 / 平价通勤包"
              maxLength={100}
              className="input-base"
            />
          </Field>

          <Field label="核心卖点" hint="每行一个卖点，写得越具体生成效果越好">
            <textarea
              value={sellingPoints}
              onChange={(e) => setSellingPoints(e.target.value)}
              placeholder={"例如：\n控油蓬松一整天\n无硅油不刺激头皮\n99元入手平替大牌"}
              rows={4}
              className="input-base resize-none"
            />
          </Field>

          <Field label="目标人群" hint="可选，越精准文案越戳心">
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="例如：油头星人 / 通勤上班族 / 学生党"
              className="input-base"
            />
          </Field>

          <Field label="文案风格">
            <StyleSelector value={style} onChange={setStyle} />
          </Field>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || exhausted}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-xhs-button py-3.5 text-base font-bold text-white shadow-xhs transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Spinner /> AI 正在憋大招...
              </>
            ) : exhausted ? (
              "今日次数已用完"
            ) : (
              "✨ 一键生成爆款文案"
            )}
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading && <LoadingSkeleton />}
        {!loading && result && <ResultCard result={result} />}
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-1.5 text-sm font-semibold text-xhs-ink">
        {label}
        {required && <span className="text-xhs-red">*</span>}
        {hint && <span className="text-xs font-normal text-xhs-plum/60">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-fade-up rounded-xhs border border-xhs-rose bg-white p-5 shadow-xhs sm:p-7">
      <div className="mb-4 h-5 w-28 rounded-full shimmer-bg" />
      <div className="mb-2 h-9 rounded-xl shimmer-bg" />
      <div className="mb-2 h-9 rounded-xl shimmer-bg" />
      <div className="mb-5 h-9 rounded-xl shimmer-bg" />
      <div className="mb-2 h-4 w-full rounded-full shimmer-bg" />
      <div className="mb-2 h-4 w-full rounded-full shimmer-bg" />
      <div className="mb-2 h-4 w-4/5 rounded-full shimmer-bg" />
      <div className="h-4 w-2/3 rounded-full shimmer-bg" />
      <p className="mt-4 text-center text-xs text-xhs-plum/60">
        正在生成中，通常需要 5-15 秒，请耐心等待～
      </p>
    </div>
  );
}
