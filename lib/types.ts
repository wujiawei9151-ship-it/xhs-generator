export type CopyStyle = "种草" | "干货" | "测评" | "情绪" | "避雷";

export const STYLE_OPTIONS: { value: CopyStyle; label: string; emoji: string; desc: string }[] = [
  { value: "种草", label: "种草", emoji: "🌱", desc: "安利分享，让人心动下单" },
  { value: "干货", label: "干货", emoji: "📚", desc: "信息量拉满，专业又实用" },
  { value: "测评", label: "测评", emoji: "🔍", desc: "客观对比，优缺点都说透" },
  { value: "情绪", label: "情绪", emoji: "💭", desc: "共情叙事，戳中内心os" },
  { value: "避雷", label: "避雷", emoji: "🚫", desc: "踩坑警告，帮粉丝避坑" },
];

export interface GenerateRequest {
  topic: string;
  sellingPoints: string;
  audience: string;
  style: CopyStyle;
}

export interface GenerateResult {
  titles: string[];
  body: string;
  tags: string[];
}

export interface GenerateResponse {
  success: boolean;
  data?: GenerateResult;
  error?: string;
}
