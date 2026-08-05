export default function Footer() {
  return (
    <footer className="mt-6 px-4 pb-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-pink-100 bg-pink-50 p-5 text-center">
        <p className="font-bold text-gray-800 text-base">
          想每天生成 10 次？
        </p >
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          加微信{" "}
          <span className="select-all font-semibold text-pink-600">
            cjj20241213
          </span>{" "}
          获取授权码，备注「文案生成器」优先通过
        </p >
        <p className="mt-1.5 text-xs text-gray-400">
          授权码有效期 30 天 · 每日 10 次免费生成
        </p >
      </div>
    </footer>
  );
}
