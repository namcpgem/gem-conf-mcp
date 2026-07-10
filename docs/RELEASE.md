# Hướng dẫn Release

## Yêu cầu

- Node.js 18+
- pnpm
- Đã cài dependencies: `pnpm install`

## Quy trình release

1. Cập nhật version trong `package.json` (theo semver).
2. Build và đóng gói:

   ```bash
   pnpm release
   ```

   Script này chạy tuần tự:
   - `scripts/build.js` — bundle `src/index.js` bằng esbuild thành file duy nhất `dist/index.js` (kèm shebang `#!/usr/bin/env node`, không cần `node_modules` khi chạy).
   - `scripts/release.js` — đóng gói `release/conf-mcp-v<version>.zip` gồm:
     - `index.js` (từ `dist/index.js`)
     - `package.json`
     - `README.md`
     - `.env.example`

3. Kiểm tra nhanh trước khi phát hành:

   ```bash
   node dist/index.js
   ```

   Server phải khởi động và log ra stderr (stdout chỉ dành cho giao thức MCP), không có lỗi.

4. Lint/type-check (khuyến nghị chạy trước khi build):

   ```bash
   pnpm lint
   ```

## Kênh phát hành

### 1. npm (khuyến nghị)

```bash
npm login                    # đăng nhập lần đầu
npm publish --dry-run        # xem trước file sẽ đóng gói
npm publish --access public  # publish thật
```

Lưu ý:

- Field `files` trong `package.json` giới hạn chỉ đóng gói `dist/` (không publish `src/`, `scripts/`, `.env`).
- Script `prepare` tự chạy `build` trước khi publish → `dist/index.js` luôn mới.
- npm không cho publish trùng version — phải bump version trong `package.json` cho mỗi lần publish.

Người dùng cài qua: `npx conf-mcp@latest` hoặc `npm i -g conf-mcp`.

### 2. GitHub (chạy trực tiếp qua npx)

```bash
npx github:namcpgem/gem-conf-mcp
```

Không publish npm. Khi cài từ git, npm tự chạy script `prepare` (đã cấu hình `"prepare": "node scripts/build.js"`) để build `dist/index.js` trước khi thực thi theo field `bin`. Chỉ cần đảm bảo:

- Repo GitHub ở chế độ **public**.
- Đã push commit mới nhất (bao gồm `package.json` có script `prepare`).

### 3. Zip thủ công (release/conf-mcp-v<version>.zip)

Dùng cho người dùng không có npm/git, xem [Hướng dẫn sử dụng](USAGE.md#cài-đặt-từ-file-zip-release).

## Checklist trước khi release

- [ ] `pnpm lint` không lỗi/cảnh báo
- [ ] `pnpm build` chạy thành công, `dist/index.js` có shebang
- [ ] Không có secret hardcode (kiểm tra `.env` không bị commit — đã có trong `.gitignore`)
- [ ] Version trong `package.json` đã bump
- [ ] README/docs phản ánh đúng danh sách tools hiện tại
