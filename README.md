# wpk-tournament-platform

WPK 公开赛锦标赛平台

## 功能概览

- 多语言首页、赛事列表、赛事详情、登录页、管理员后台
- 个人俱乐部晋级赛说明（11房百人局、淘汰机制、总决赛奖励）
- Supabase Auth 登录 / 注册
- USDT 报名流程
- 成绩上传与积分录入
- 排行榜与公告接口

## 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase

## 本地开发

1. 安装依赖
   ```bash
   npm install
   ```

2. 配置环境变量
   创建 `.env` 文件并填入：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. 创建 Supabase 数据库结构
   - 新建一个 Supabase 项目
   - 打开 SQL Editor
   - 执行 `supabase/schema.sql`

4. 创建 Storage Bucket
   - 创建名为 `proofs` 的 bucket
   - 设置为公开可读（public）

5. 启动开发服务器
   ```bash
   npm run dev
   ```

6. 访问地址
   - 中文：`http://localhost:3000/?lang=zh`
   - English：`http://localhost:3000/?lang=en`
   - Français：`http://localhost:3000/?lang=fr`

## 管理后台

- `/admin`
- `/admin/tournaments`
- `/admin/results`

## 说明

- 当前版本为 MVP 原型，适合快速演示和后续扩展。
- 如果你希望接入真实支付、邮件验证、后台权限控制、公告管理和多语言内容管理，可以继续扩展。
