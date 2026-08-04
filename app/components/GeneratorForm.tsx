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
  const [remaining, setRemaining] = useState<string | number>("1");
  const [isVip, setIsVip] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const usage = getUsage();
    setIsVip(usage.isVip);
    setRemaining(getRemaining());
  }, []);

  const handleActivate = () => {
    if (activateVip(authCode)) {
      setAuthMessage("授权成功！已开通30天无限次");
      setIsVip(true);
      setRemaining("无限次");
      setAuthCode("");
    } else {
      setAuthMessage("授权码错误，请检查后重试");
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate()) {
      setError("今日免费次数已用完，请输入授权码解锁或明天再来");
      return;
    }

    if (!product.trim()) {
      setError("请填写产品名称");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, points, audience, style }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "生成失败");
      }

      increaseUsage();
      setResult(data);
      setRemaining(getRemaining());
    } catch (err: any) {
      setError(err.message || "生成失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">填写笔记信息</h2>
        <span className="text-sm bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
          {isVip ? "VIP无限次" : `今日剩余 ${remaining} 次`}
        </span>
      </div>

      {!isVip && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-2">输入授权码可解锁30天无限次</p >
          <div className="flex gap-2">
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="请输入授权码"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleActivate}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600"
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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">产品名称 / 主题 *</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="例如：小众氨基酸洗发水"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">核心卖点</label>
          <textarea
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="每行一个卖点"
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">目标人群（可选）</label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="例如：油头女生、学生党"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">选择风格</label>
          <div className="flex flex-wrap gap-2">
            {["种草", "干货", "测评", "情绪", "避雷"].map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-4 py-1.5 rounded-full text-sm ${
                  style === s ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p >}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-pink-500 text-white py-3 rounded-xl font-medium hover:bg-pink-600 disabled:opacity-50"
        >
          {loading ? "生成中..." : "一键生成爆款文案"}
        </button>
      </div>

      {result && (
        <div className="mt-8 border-t pt-6">
          <h3 className="font-bold text-lg mb-3">生成结果</h3>
          <div className="space-y-3">
            {result.titles?.map((title: string, i: number) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg">
                {i + 1}. {title}
              </div>
            ))}
            <div className="bg-pink-50 p-4 rounded-lg whitespace-pre-wrap">
              {result.content}
            </div>
            <button
              onClick={() => {
                const text = (result.titles?.[0] || "") + "\n\n" + result.content;
                navigator.clipboard.writeText(text);
                alert("已复制全部内容");
              }}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              一键复制全部
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
