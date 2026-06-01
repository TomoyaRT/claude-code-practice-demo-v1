---
name: review-pr
description: >
  Phase 完成後的品質審查。檢查程式碼品質、安全性、效能、RWD。
  使用 /review-pr 觸發，或說「審查」、「phase 完成了嗎」。
auto-invoke: false
---

# Review Skill

## 執行的審查項目

```bash
# 1. TypeScript
npx tsc --noEmit

# 2. ESLint
npm run lint

# 3. Build
npm run build

# 4. 檢查禁止的模式
echo "=== 檢查 any 型別 ==="
grep -r ": any" src/ --include="*.ts" --include="*.tsx" | head -10

echo "=== 檢查 console.log ==="
grep -r "console\.log" src/ --include="*.ts" --include="*.tsx" | head -10

echo "=== 檢查 hardcoded secrets ==="
grep -rE "(api_key|apiKey|secret|password)\s*=\s*['\"]" src/ | head -10

echo "=== 檢查缺少 alt 的 img ==="
grep -r "<img " src/ --include="*.tsx" | grep -v "alt=" | head -10
```

## 人工確認清單
- [ ] RWD 正常（手機/平板/桌面）
- [ ] prefers-reduced-motion 支援
- [ ] 所有連結和按鈕可鍵盤操作
- [ ] 無 console 錯誤

## 輸出
列出所有問題，severity 分級：
- 🔴 必須修復（阻擋 commit）
- 🟡 建議修復
- 🟢 通過
