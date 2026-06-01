#!/usr/bin/env bash
# PreToolUse/Bash: 阻擋危險指令

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null || echo "")

# 危險指令黑名單
DANGEROUS_PATTERNS="rm -rf /|rm -rf \.|DROP TABLE|DROP DATABASE|format c:|> /dev/sd|git push --force|git push -f"

if echo "$COMMAND" | grep -qE "$DANGEROUS_PATTERNS"; then
  echo "🚫 危險指令被阻擋: $COMMAND" >&2
  echo "請確認此指令的必要性，需要時請手動執行。" >&2
  exit 2
fi

# 阻擋直接寫入 .env.local（必須透過 deploy-agent）
if echo "$COMMAND" | grep -q "\.env\.local" && echo "$COMMAND" | grep -qE "echo|printf|tee|>"; then
  echo "🔒 .env.local 受保護，請透過 deploy-agent 管理環境變數。" >&2
  exit 2
fi

exit 0
