---
name: deploy
description: >
  執行完整部署流程：lint → typecheck → build → commit → push → 驗證。
  使用 /deploy 觸發，或說「部署」、「push 到 GitHub」、「上線」。
auto-invoke: false
---

# Deploy Skill

執行標準部署流程。

## 步驟

```bash
# 1. 確認無未儲存的危險狀態
git status

# 2. 品質檢查
npm run lint && echo "✅ Lint passed" || exit 1
npx tsc --noEmit && echo "✅ TypeScript passed" || exit 1
npm run build && echo "✅ Build passed" || exit 1

# 3. Commit（如有未 commit 的變更）
git add -A
git status --short

# 4. Push
git push origin $(git branch --show-current)

echo "🚀 Deploy triggered. Vercel will auto-deploy from GitHub push."
echo "📊 Check: https://vercel.com/dashboard"
```

## 失敗處理
- Lint 失敗：回報錯誤，等待 frontend-agent 修復
- TypeScript 失敗：回報錯誤，等待 frontend-agent 修復
- Build 失敗：回報完整錯誤訊息
- Push 失敗：檢查 GitHub token 和網路連線
