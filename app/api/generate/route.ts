import { NextRequest, NextResponse } from "next/server";
import type { GenerateRequest, GenerateResult } from "@/lib/types";

export const runtime = "nodejs";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

const STYLE_GUIDE: Record<string, string> = {
  种草: "语气亲切安利，像在跟闺蜜分享私藏好物，重点突出「为什么必须买」，多用感叹和细节描写制造心动感。",
  干货: "结构清晰、信息密度高，像小红书知识博主整理笔记，多用序号/要点，突出实用性和可操作性。",
  测评: "客观理性，正反对比，说清楚优点和缺点，给出适用人群和购买建议，避免一味吹捧。",
  情绪: "以第一人称叙事切入，先讲故事/场景引发共鸣，再自然带出产品，情绪张力强，戳中读者内心os。",
  避雷: "语气像在提醒姐妹们避坑，先讲踩雷经历或常见误区，再给出正确选择建议，带一点吐槽感。",
};

function buildPrompt(input: GenerateRequest): string {
  const { topic, sellingPoints, audience, style } = input;
  const styleDesc = STYLE_GUIDE[style] || STYLE_GUIDE["种草"];

  return `你是一名资深小红书爆款文案写手，擅长写出高互动、高收藏的笔记。

请根据以下信息，生成一篇小红书风格的笔记文案：

【主题/产品】${topic}
【核心卖点】${sellingPoints || "（未提供，请合理发挥）"}
【目标人群】${audience || "（未指定，请自行判断）"}
【文案风格】${style} —— ${styleDesc}

写作要求：
1. 生成 3 个吸睛标题，每个不超过 20 字，善用数字、对比、悬念、口语化表达，要能让人忍不住点进来。
2. 正文控制在 300-500 字，要求：
   - 开头 1-2 句话必须抓住注意力（痛点/悬念/反常识）
   - 全文口语化、分段清晰（每段 2-4 行），大量使用小红书常见 emoji 穿插在文字间
   - 结合核心卖点具体展开，避免空话套话
   - 结尾自然引导互动（如提问、召唤收藏/评论）
   - 符合「${style}」的语气特点
3. 生成 6-10 个与主题相关的推荐话题标签（不带#号，纯文字，要贴近小红书真实热门标签习惯）。

请严格按照以下 JSON 格式输出，不要输出任何其他文字、解释或 markdown 代码块标记：
{
  "titles": ["标题1", "标题2", "标题3"],
  "body": "正文内容，用\\n表示换行",
  "tags": ["标签1", "标签2", "..."]
}`;
}

function safeParseResult(raw: string): GenerateResult | null {
  let text = raw.trim();
  // 去除可能的 markdown 代码块包裹
  text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");
  try {
    const parsed = JSON.parse(text);
    if (
      Array.isArray(parsed.titles) &&
      typeof parsed.body === "string" &&
      Array.isArray(parsed.tags)
    ) {
      return {
        titles: parsed.titles.slice(0, 3).map(String),
        body: String(parsed.body),
        tags: parsed.tags.map(String),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "服务器未配置 DEEPSEEK_API_KEY，请联系管理员配置后重试。" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as any;
const topic = (body.product || body.topic || "").trim();
const sellingPoints = (body.points || body.sellingPoints || "").trim();
const audience = (body.audience || "").trim();
const style = body.style || "种草";

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "请填写产品名称或主题" },
        { status: 400 }
      );
    }
    if (topic.length > 100) {
      return NextResponse.json(
        { success: false, error: "主题内容过长，请精简在 100 字以内" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt({ topic, sellingPoints, audience, style: style as any });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    let upstreamRes: Response;
    try {
      upstreamRes = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "你是一名专业的小红书爆款文案写手，只输出要求的 JSON，不输出任何多余文字。",
            },
            { role: "user", content: prompt },
          ],
          temperature: 1.1,
          max_tokens: 1500,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      });
    } catch (e) {
      clearTimeout(timeout);
      const isAbort = e instanceof Error && e.name === "AbortError";
      return NextResponse.json(
        {
          success: false,
          error: isAbort
            ? "生成超时，AI 老师有点忙，请稍后再试～"
            : "网络请求失败，请检查网络后重试",
        },
        { status: 504 }
      );
    }
    clearTimeout(timeout);

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text().catch(() => "");
      console.error("DeepSeek API error:", upstreamRes.status, errText);
      const msg =
        upstreamRes.status === 401
          ? "AI 服务鉴权失败，请联系管理员检查 API Key"
          : upstreamRes.status === 429
          ? "请求太多啦，AI 老师需要喘口气，稍后再试～"
          : "AI 生成失败，请稍后重试";
      return NextResponse.json({ success: false, error: msg }, { status: 502 });
    }

    const data = await upstreamRes.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { success: false, error: "AI 没有返回有效内容，请重试" },
        { status: 502 }
      );
    }

    const result = safeParseResult(content);
    if (!result) {
      return NextResponse.json(
        { success: false, error: "文案解析失败，请重新生成一次" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Unexpected error in /api/generate:", err);
    return NextResponse.json(
      { success: false, error: "服务器出错了，请稍后重试" },
      { status: 500 }
    );
  }
}
