"use client";

import { useState, useEffect } from "react";
import { canGenerate, increaseUsage, getRemaining, activateVip, getUsage } from "@/lib/usage";

export default function GeneratorForm() {
  const [product, setProduct] = useState("");
  const [points, setPoints] = useState("");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState("种草");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number>(1);
  const [isVip, setIsVip] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const usage = getUsage();
    setIsVip(usage.isVip);
    setRemaining(getRemaining());
  }, []);

  const handleActivate = () => {
    if (!authCode.trim()) {
      setAuthMessage("请输入授权码");
      return;
    }
    if (activateVip(authCode)) {
      setAuthMessage("授权成功！已开通30天每日10次");
      setIsVip(true);
      setRemaining(getRemaining());
      setAuthCode("");
    } else {
      setAuthMessage("授权码错误，请检查后重试");
    }
  };

  const handleGenerate = async () => {
    setError("");

    if (!product.trim()) {
      setError("请填写产品名称或主题");
      return;
    }

    if (!canGenerate()) {
      setError(isVip ? "今日VIP次数已用完，请明天再来" : "今日免费次数已用完，请输入授权码解锁");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.trim(),
          points: points.trim(),
          audience: audience.trim(),
          style,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "生成失败，请稍后重试");
      }

      // 正确取数据
      increaseUsage();
      setRemaining(getRemaining());
      setResult(data.data); // 这里是关键
    } catch (err: any) {
      setError(err.message || "生成失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {!isVip && (
        <div className="mb-6 p-4 bg-pink-50 border border-pink-100 rounded-2xl">
          <p className="text-sm text-pink-700 mb-3 font-medium">
            输入授权码可解锁30天每日10次生成
          </p >
          <div className="flex gap-3">
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="请输入授权码"
              className="flex-1 border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
              onClick={handleActivate}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
            >
              激活
            </button>
          </div>
          {authMessage && (
            <p className={`text-sm mt-2 ${authMessage.includes("成功") ? "text-green-600" : "text-red-500"}`}>
              {authMessage}
            </p >
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">填写笔记信息</h2>
          <span className="text-sm bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-medium">
            {isVip ? `VIP剩余 ${remaining} 次` : `今日剩余 ${remaining} 次`}
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              产品名称 / 主题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="例如：小众氨基酸洗发水 / 平价通勤包"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              核心卖点
              <span className="text-gray-400 font-normal ml-1">每行一个卖点，写得越具体生成效果越好</span>
            </label>
            <textarea
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="例如：控油蓬松一整天"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              目标人群
              <span className="text-gray-400 font-normal ml-1">可选，越精准文案越戳心</span>
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="例如：油头星人 / 通勤上班族 / 学生党"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择风格</label>
            <div className="flex flex-wrap gap-2">
              {["种草", "干货", "测评", "情绪", "避雷"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                    style === s
                      ? "bg-pink-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p >
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3.5 rounded-xl font-medium text-base transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? "生成中，请稍候..." : "一键生成爆款文案"}
          </button>
        </div>
      </div>

      {/* 生成结果 */}
      {result && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-gray-800">✨ 生成结果</h3>
            <button
              onClick={() => {
                const text = (result.titles?.[0] || "") + "\n\n" + (result.body || "");
                navigator.clipboard.writeText(text);
                alert("已复制全部内容");
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              一键复制全部
            </button>
          </div>

          {result.titles && result.titles.length > 0 && (
            <div className="space-y-3 mb-5">
              <p className="text-sm text-gray-500">吸睛标题</p >
              {result.titles.map((title: string, i: number) => (
                <div key={i} className="bg-gray-50 hover:bg-pink-50 p-3 rounded-xl transition">
                  {i + 1}. {title}
                </div>
              ))}
            </div>
          )}

          {result.body && (
            <div className="bg-pink-50 p-5 rounded-xl whitespace-pre-wrap leading-relaxed text-gray-800">
              {result.body}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
