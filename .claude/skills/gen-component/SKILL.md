---
name: gen-component
description: >
  快速生成標準 React 元件模板。
  使用 /gen-component <ComponentName> 觸發。
auto-invoke: false
---

# Gen Component Skill

根據提供的元件名稱，生成符合專案規範的 TypeScript React 元件骨架。

## 生成規則
1. 讀取 `.claude/rules/frontend.md` 確認規範
2. 讀取 `src/styles/globals.css` 確認可用的 CSS Variables
3. 根據元件位置決定是否需要 "use client"
4. 生成完整的 TypeScript interface 和元件

## 標準 Server Component 模板
```typescript
// src/components/<category>/<ComponentName>.tsx
import { cn } from "@/lib/utils"

interface <ComponentName>Props {
  className?: string
  // ... props
}

export function <ComponentName>({ className, ...props }: <ComponentName>Props) {
  return (
    <div className={cn("", className)}>
      {/* content */}
    </div>
  )
}
```

## 帶動畫的 Client Component 模板
```typescript
"use client"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface <ComponentName>Props {
  className?: string
}

export function <ComponentName>({ className }: <ComponentName>Props) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.div
      className={cn("", className)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* content */}
    </motion.div>
  )
}
```
