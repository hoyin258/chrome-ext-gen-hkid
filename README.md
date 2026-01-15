# HKID Generator

[English](#english) | [中文](#中文)

---

## English

### Overview
A Chrome Extension that generates valid Hong Kong Identity Card (HKID) numbers with proper checksum validation. Supports both old (1 letter + 6 numbers) and new (2 letters + 6 numbers) formats.

### Features
- Generate valid HKID numbers (old & new format)
- Automatic checksum calculation
- History management with local storage
- Add remarks/notes to each record
- Export/Import history as JSON
- Search through generated records
- Auto-copy on click

### Installation
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer Mode** (toggle in top right)
4. Click **"Load unpacked"**
5. Select the project folder

### Usage
1. Click the extension icon in Chrome toolbar
2. A new HKID is generated automatically
3. Click the number to copy to clipboard (auto-generates new one)
4. Add remarks in the history panel to keep track
5. Use the history panel to view, search, and manage all generated IDs

### Algorithm
Uses the official HKID checksum algorithm:

**Old Format (1 letter + 6 numbers)**
- Example: `A123456(3)`
- Weights: `[36, 7, 6, 5, 4, 3, 2]`
- Sum = 36 + (D1×7) + (D2×6) + (D3×5) + (D4×4) + (D5×3) + (D6×2)
- CheckDigit based on Sum % 11

**New Format (2 letters + 6 numbers)**
- Example: `AD123456(3)`
- Weights: `[11+Index(A), 11+Index(D), 7, 6, 5, 4, 3, 2]`
- Letter weight = 10 + letter index (A=1 → 11, B=2 → 12, etc.)

### Screenshots
_(Add screenshots here for Chrome Web Store)_

### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

### License
MIT License - feel free to use this project for any purpose.

---

## 中文

### 概述
Chrome 擴充功能，生成有效的香港身份證號碼，支援校驗位計算。支援舊式（1字母+6數字）和新式（2字母+6數字）格式。

### 功能
- 生成有效 HKID 號碼（新舊格式）
- 自動校驗位計算
- 本地儲存歷史記錄
- 為每筆記錄新增備註
- 匯出/匯入歷史記錄（JSON 格式）
- 搜尋已生成的記錄
- 點擊自動複製

### 安裝方法
1. 複製或下載此倉庫
2. 打開 Chrome，進入 `chrome://extensions/`
3. 開啟**開發人員模式**（右上角開關）
4. 點擊**「載入未封裝項目」**
5. 選擇專案資料夾

### 使用方法
1. 點擊 Chrome 工具列中的擴充功能圖示
2. 自動生成新 HKID
3. 點擊號碼複製到剪貼簿（會自動生成新號碼）
4. 在歷史面板新增備註以追蹤
5. 使用歷史面板查看、搜尋和管理所有記錄

### 演算法
使用官方 HKID 校驗位演算法：

**舊式（1字母 + 6數字）**
- 例如：`A123456(3)`
- 權重：`[36, 7, 6, 5, 4, 3, 2]`
- Sum = 36 + (D1×7) + (D2×6) + (D3×5) + (D4×4) + (D5×3) + (D6×2)
- 校驗位基於 Sum % 11 計算

**新式（2字母 + 6數字）**
- 例如：`AD123456(3)`
- 權重：`[11+Index(A), 11+Index(D), 7, 6, 5, 4, 3, 2]`
- 字母權重 = 10 + 字母索引（A=1 → 11，B=2 → 12，依此類推）

### 截圖
_(請在此處添加 Chrome 網上商店截圖)_

### 貢獻
歡迎貢獻！請隨時提交 Pull Request。

### 授權
MIT License - 可自由用於任何用途。

---

## Project Structure

```
hkid-generator/
├── manifest.json       # Chrome Extension MV3 config
├── popup.html          # Extension UI
├── popup.js            # Core logic
├── style.css           # Styles
├── icons/              # Extension icons
├── AGENTS.md           # Developer documentation
└── LICENSE             # MIT License
```
