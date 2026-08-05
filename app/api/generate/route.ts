import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, points, audience, style } = body;

    if (!product?.trim()) {
      return NextResponse.json(
        { success: false, error: "请填写产品名称或主题" },
        { status: 400 }
      );
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { success: false, error: "服务器未配置 API Key" },
        { status: 500 }
      );
    }

    const styleGuide: Record<string, string> = {
      种草: "语气热情安利，强调使用感受和效果，多用感叹和emoji，让人很想立刻下单",
      干货: "结构清晰、信息密度高，像小红书知识博主整理笔记，多用序号/要点",
      测评: "客观理性，正反对比，说清楚优点和缺点，给出适用人群和购买建议",
      情绪: "以第一人称叙事切入，先讲故事/场景引发共鸣，再自然带出产品，情绪饱满",
      避雷: "语气像在提醒姐妹们避坑，先讲踩雷经历或常见误区，再给出正确选择建议",
    };

    const systemPrompt = `你是一位顶级小红书爆款文案专家。

请严格按照以下 JSON 格式输出（不要 markdown 代码块，不要多余文字）：

{
  "titles": ["标题1", "标题2", "标题3"],
  "body": "完整正文内容（必须分段、大量使用emoji、口语化、有情绪、有互动感）"
}

写作要求：
1. 标题：吸睛、带数字或痛点或惊喜，控制在20字左右，可加emoji
2. 正文：开头强钩子 → 痛点共鸣 → 产品解决方案 → 使用场景/效果 → 结尾号召行动。大量emoji，分段清晰，口语化
3. 风格要求：${styleGuide[style] || styleGuide["种草"]}
4. 全程中文`;

    const userPrompt = `产品/主题：${product}
核心卖点：${points || "无"}
目标人群：${audience || "不限"}
风格：${style || "种草"}

请生成小红书爆款文案。`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content || "";
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      data: {
        titles: parsed.titles || [],
        body: parsed.body || "",
      },
    });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
