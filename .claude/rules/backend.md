# Backend 開發規範（Next.js API Routes）

## API 架構
- 路由位置：`src/app/api/<resource>/route.ts`
- 業務邏輯：`src/services/<resource>.service.ts`
- 禁止在 route.ts 直接寫複雜邏輯，必須透過 service 層

## 請求驗證
- 所有 POST/PUT/PATCH 必須用 **Zod** 驗證 request body
- 驗證失敗回傳 400：`{ error: "Validation failed", details: [...] }`

## 回應格式（統一）
```typescript
// 成功
{ data: T, message?: string }

// 失敗
{ error: string, code: string }
```

## HTTP 狀態碼
- 200：成功
- 400：驗證失敗 / 參數錯誤
- 401：未認證
- 403：無權限
- 404：找不到資源
- 500：伺服器錯誤（不暴露內部細節給用戶端）

## 安全性
- 所有 API 必須處理 CORS（在 next.config.ts 設定）
- Contact form 必須加 rate limiting（使用 Upstash Redis 或簡單 IP 計數）
- 禁止在 response 中暴露 stack trace
- 環境變數必須在 server-side 讀取，禁止暴露給 client

## Email（Resend）
- 發信邏輯在 `src/services/email.service.ts`
- 失敗必須 retry 一次，再失敗才回傳 500
- 發信前驗證 email 格式
- 禁止在 client-side 直接呼叫 Resend API

## MVP 的 API
只需要一個：
- `POST /api/contact` — 接收聯絡表單，發送 email 通知
