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
  const [remaining, setRemaining] = useState("1");
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
        headers:​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
