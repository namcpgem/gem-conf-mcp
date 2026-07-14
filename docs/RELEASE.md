# Hướng dẫn Release

## Yêu cầu

- Node.js 18+
- pnpm
- Đã cài dependencies: `pnpm install`

## Quy trình release

1. Release (không cần commit trước):

   ```bash
   pnpm release
   ```

   Lệnh này chạy release-it với các bước tự động:
   - Chạy `npm run lint` + `npm run build` trước tiên
   - Hỏi phiên bản mới (bump tự động)
   - Commit thay đổi với message "chore: release v${version}"
   - Tạo git tag "v${version}"
   - Push commit và tag
   - Tạo release trên GitHub
   - Publish lên npm

   Không cần commit hay thao tác git trước `pnpm release`; release-it tự xử lý.

2. Đóng gói zip release:

   ```bash
   pnpm archive
   ```

   Script này chạy tuần tự:
   - `scripts/build.js` — bundle `src/index.js` bằng esbuild thành file duy nhất `dist/index.js` (kèm shebang `#!/usr/bin/env node`, không cần `node_modules` khi chạy).
   - `scripts/archive.js` — đóng gói `release/conf-mcp-v<version>.zip` gồm:
     - `index.js` (từ `dist/index.js`)
     - `package.json`
     - `README.md`
     - `.env.example`

3. Kiểm tra nhanh sau build:

   ```bash
   node dist/index.js
   ```

   Server phải khởi động và log ra stderr (stdout chỉ dành cho giao thức MCP), không có lỗi.

## Kênh phát hành

Release-it tự động xử lý npm publish trong quá trình `pnpm release`. Các kênh cài đặt cho người dùng:

### 1. npm (khuyến nghị)

Khi chạy `pnpm release`, release-it tự publish lên npm (xem config `npm.publish: true` trong `.release-it.json`).

Người dùng cài qua: `npx conf-mcp@latest` hoặc `npm i -g conf-mcp`.

Lưu ý:

- Field `files` trong `package.json` giới hạn chỉ đóng gói `dist/` (không publish `src/`, `scripts/`, `.env`).
- Script `prepare` tự chạy `npm run build` trước khi publish → `dist/index.js` luôn mới.

### 2. GitHub (không publish npm)

```bash
npx github:namcpgem/gem-conf-mcp
```

Khi cài từ git, npm tự chạy script `prepare` (cấu hình `"prepare": "npm run build"`) để build `dist/index.js`. Chỉ cần đảm bảo:

- Repo GitHub ở chế độ **public**.
- Đã push tag từ `pnpm release` (release-it tự tạo và push).

### 3. Zip thủ công (release/conf-mcp-v<version>.zip)

Sau khi release-it publish xong, chạy `pnpm archive` để đóng gói zip cho người dùng không có npm/git, xem [Hướng dẫn sử dụng](USAGE.md#cài-đặt-từ-file-zip-release).

## Checklist trước khi chạy `pnpm release`

- [ ] Không có secret hardcode (kiểm tra `.env` không bị commit — đã có trong `.gitignore`)
- [ ] Danh sách tools/params trong README/docs phản ánh đúng source code hiện tại
- [ ] Branch chính đã up-to-date với remote (các thay đổi cần release đã commit)

Release-it sẽ tự động:

- [ ] Chạy lint và build
- [ ] Bump version trong `package.json`
- [ ] Commit, tag, push, publish npm
