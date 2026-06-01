#!/usr/bin/env bash
# PreToolUse/Write|Edit: 保護敏感檔案

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""' 2>/dev/null || echo "")

PROTECTED_PATHS="\.env|\.env\.local|\.env\.production|package-lock\.json|\.claude/settings\.json"

if echo "$FILE_PATH" | grep -qE "$PROTECTED_PATHS"; then
  echo "🔒 受保護的檔案: $FILE_PATH" >&2
  echo "此檔案不允許直接修改。如需更新，請說明原因。" >&2
  exit 2
fi

exit 0
