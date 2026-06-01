# 資料庫規範

## MVP 階段
MVP **不使用資料庫**。Contact form 直接發 email（Resend）。
以下規範為未來擴展時使用。

## 未來擴展時的規範（Prisma + PostgreSQL）
- 所有 table 必須有 `id`、`createdAt`、`updatedAt`
- 外鍵必須明確設定 `onDelete` 行為
- 禁止直接在 route.ts 寫 Prisma query，必須透過 service 層
- 禁止 `prisma migrate reset`（會清除所有資料）
- 禁止直接操作 production DB
- Migration 命名格式：`<feature>_<action>`（例：`add_projects_table`）

## MVP 的資料儲存策略
- 作品集資料：靜態 JSON 檔案（`src/data/projects.ts`）
- 服務定價：靜態 TypeScript 常數（`src/data/services.ts`）
- 聯絡表單：直接發 email，不儲存到 DB
