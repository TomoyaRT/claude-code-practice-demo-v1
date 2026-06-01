# Git 工作流規範

## Commit 格式
```
<type>: <phase-tag> <簡短描述>

type: feat | fix | style | refactor | chore | docs
phase-tag: [phase-1] [phase-2] ... [phase-8]
```

範例：
- `feat: [phase-3] hero section with shader background`
- `fix: [phase-5] pricing card layout on mobile`
- `chore: [phase-1] init Next.js project with dependencies`

## 分支策略（MVP 簡化版）
- `main`：永遠是可部署狀態
- `dev`：開發分支（每個 Phase 在此開發）
- Phase 完成後 merge 到 main，觸發 Vercel 自動部署

## 禁止事項
- 禁止 `git push --force`（任何情況）
- 禁止在 main 直接開發
- 禁止 commit `.env.local` 或任何含有 secret 的檔案

## .gitignore 必須包含
```
.env.local
.env.production
node_modules/
.next/
```

## Phase 完成的 commit 格式
```
feat: [phase-X] complete — <功能摘要>
```
