export default function Hero() {
  return (
    <header className="relative overflow-hidden px-4 pb-10 pt-14 sm:pb-14 sm:pt-20">
      {/* 装饰性光斑 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-10 h-56 w-56 rounded-full bg-xhs-pink/25 blur-3xl animate-blob"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-24 h-64 w-64 rounded-full bg-xhs-coral/25 blur-3xl animate-blob"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-xhs-pink/30 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-xhs-red shadow-xhs-sm backdrop-blur">
          💌 灵感枯竭救星 · AI 一键出稿
        </span>

        <h1 className="font-display text-3xl font-extrabold leading-tight text-xhs-ink sm:text-5xl">
          3 秒憋出
          <span className="bg-xhs-button bg-clip-text text-transparent"> 小红书爆款 </span>
          文案
        </h1>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-xhs-plum sm:text-base">
          填写产品信息，选一个风格，AI 帮你搞定标题、正文和话题标签，
          告别对着空白文档发呆的痛苦～
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-xhs-plum/70 sm:text-sm">
          <Pill>🌱 种草</Pill>
          <Pill>📚 干货</Pill>
          <Pill>🔍 测评</Pill>
          <Pill>💭 情绪</Pill>
          <Pill>🚫 避雷</Pill>
          <span>五种风格随心选</span>
        </div>
      </div>
    </header>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/80 px-2.5 py-1 shadow-sm">
      {children}
    </span>
  );
}
