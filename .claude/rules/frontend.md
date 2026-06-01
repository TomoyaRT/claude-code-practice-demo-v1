# Frontend 開發規範（Next.js / React / TypeScript）

## 元件架構
- 預設使用 **Server Component**，只在需要互動、useState、useEffect、瀏覽器 API 時加 `"use client"`
- 資料 fetching 在 Server Component 做，禁止在 Client Component 使用 useEffect + fetch
- Loading state：使用 Suspense + `loading.tsx`
- 錯誤處理：使用 `error.tsx`

## TypeScript
- 嚴格模式，禁止 `any`（用 `unknown` + type guard）
- 所有 props 必須定義 interface
- 事件 handler 明確標示型別

## 元件規範
- 單一職責：元件超過 **120 行** 必須拆分
- 命名：PascalCase（元件）、camelCase（函式/變數）
- 路徑別名：使用 `@/` 代替相對路徑
- 禁止在元件內部定義不必要的 inline function（影響效能）

## 目錄結構
```
src/components/
├── ui/          # 通用無狀態元件（Button, Card, Badge...）
├── sections/    # 頁面區塊（Hero, About, Work, Services, Contact）
├── canvas/      # WebGL / Shader / Three.js 元件
└── layout/      # Header, Footer, Navigation
```

## 樣式
- 使用 **Tailwind CSS** + CSS Variables
- 禁止 inline style（除非動態動畫值）
- RWD：Mobile First，斷點：sm(640) md(768) lg(1024) xl(1280)
- 色彩系統：使用 CSS Variables，定義在 `globals.css`

## 動畫規則
- Framer Motion：頁面轉場、元素進場、互動回饋
- GSAP：ScrollTrigger、時間軸動畫、複雜序列
- Shader（react-three-fiber）：背景視覺特效
- **必須支援** `prefers-reduced-motion`：動畫包在 media query 判斷內
- 禁止在首次 paint 前阻塞的動畫

## 效能
- 所有圖片使用 `next/image`，必須設定 `alt` 和尺寸
- 動態 import 大型套件（Three.js、GSAP）
- 字型使用 `next/font`
- 目標：LCP < 2.5s、CLS < 0.1、FID < 100ms

## 表單
- 使用 react-hook-form + zod validation
- 送出後禁止 double submit（設定 isSubmitting 狀態）
- 必須有 loading、success、error 三種狀態回饋
