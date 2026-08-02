# 小红书爆款文案一键生成器

基于 Next.js 14 (App Router) + Tailwind CSS + TypeScript 的小红书风格文案生成工具，服务端调用 DeepSeek API。

## 功能

- 粉色系小红书风格首页，移动端友好
- 输入产品/主题、核心卖点、目标人群，选择 5 种文案风格之一
- 一键生成 3 个标题 + 正文 + 推荐话题标签
- 一键复制全部内容
- 免费用户每日 3 次生成额度（localStorage 记录，无需登录）
- API Key 仅在服务端使用，不会暴露给浏览器
- 友好的加载动画与错误提示

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

复制环境变量示例文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 DeepSeek API Key（[获取地址](https://platform.deepseek.com/)）：

```
DEEPSEEK_API_KEY=sk-你的密钥
```

### 3. 本地运行

```bash
npm run dev
```

打开 http://localhost:3000 即可使用。

### 4. 生产构建

```bash
npm run build
npm run start
```

## 项目结构

```
xhs-generator/
├── app/
│   ├── api/generate/route.ts   # 服务端 API 路由，调用 DeepSeek
│   ├── components/
│   │   ├── Hero.tsx            # 首页顶部展示
│   │   ├── GeneratorForm.tsx   # 核心表单 + 生成逻辑 + 限额
│   │   ├── StyleSelector.tsx   # 风格选择器
│   │   ├── ResultCard.tsx      # 结果展示卡片 + 一键复制
│   │   └── Footer.tsx          # 底部付费占位提示
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── types.ts                # 共享类型
│   └── usage.ts                # 每日免费次数逻辑（localStorage）
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 说明与限制

- **每日限额**基于浏览器 `localStorage` 实现，仅为演示用途；清除浏览器数据或更换设备/浏览器即可绕过，正式上线建议改为后端 + 用户账号/IP 维度限流。
- **付费解锁**当前仅为底部占位文案（加微信），可自行替换为真实的支付/会员方案。
- 部署到 Vercel 等平台时，请在项目环境变量中配置 `DEEPSEEK_API_KEY`，不要提交 `.env.local` 到代码仓库。
