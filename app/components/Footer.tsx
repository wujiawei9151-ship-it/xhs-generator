export default function Footer() {
  return (
    <footer className="mt-14 px-4 pb-10">
      <div className="mx-auto max-w-2xl rounded-xhs border border-xhs-coral/30 bg-gradient-to-r from-xhs-rose to-orange-50 p-5 text-center shadow-xhs-sm sm:p-6">
        <p className="font-display text-base font-bold text-xhs-ink sm:text-lg">
          🔓 想不限次数生成？
        </p>
        <p className="mt-1.5 text-sm text-xhs-plum">
          加微信 <span className="font-semibold text-xhs-red">xxxxxx</span>{" "}
          咨询无限次生成 / 批量出稿方案，备注「文案生成器」优先通过～
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-xhs-plum/50">
        内容由 AI 生成，仅供创作参考，发布前请自行核实信息准确性。
      </p>
    </footer>
  );
}
