#!/usr/bin/env bash
# PostToolUse/Write|Edit: 自動格式化與型別檢查

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""' 2>/dev/null || echo "")

# 只處理 TS/TSX/JS/JSX/CSS 檔案
if ! echo "$FILE_PATH" | grep -qE "\.(ts|tsx|js|jsx|css|json)$"; then
  exit 0
fi

# 確認在專案目錄內
if [ ! -f "package.json" ]; then
  exit 0
fi

# Prettier 格式化
if command -v npx &>/dev/null && [ -f ".prettierrc" ] || [ -f "prettier.config.js" ] || [ -f "prettier.config.ts" ]; then
  npx prettier --write "$FILE_PATH" 2>/dev/null || true
fi

# ESLint fix（只處理 TS/TSX/JS/JSX）
if echo "$FILE_PATH" | grep -qE "\.(ts|tsx|js|jsx)$"; then
  npx eslint --fix "$FILE_PATH" 2>/dev/null || true
fi

# TypeScript 型別檢查（快速模式，不阻擋）
if echo "$FILE_PATH" | grep -qE "\.(ts|tsx)$"; then
  TYPECHECK_OUTPUT=$(npx tsc --noEmit --skipLibCheck 2>&1 | head -20)
  if [ -n "$TYPECHECK_OUTPUT" ]; then
    echo "⚠️ TypeScript 型別錯誤（請在下一步修復）:"
    echo "$TYPECHECK_OUTPUT"
  fi
fi

exit 0
