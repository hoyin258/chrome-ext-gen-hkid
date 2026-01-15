# HKID Generator Chrome Extension

## Overview
- 類型: Chrome Extension (Manifest V3)
- 功能: 生成香港身份證號碼 + 歷史記錄管理
- 技術: Vanilla JavaScript, HTML, CSS, Chrome Storage API
- 目標: 支援新舊版 HKID 生成，自動生成，歷史記錄管理，備註編輯

## Development Environment

### 載入擴充功能
1. 打開 Chrome，輸入 chrome://extensions/
2. 開啟「開發人員模式」(右上角 toggle)
3. 按「載入未封裝項目」
4. 選擇專案資料夾

### 測試流程
- 修改程式碼後按「重新整理」按鈕
- 關閉再開 popup 測試新功能

## Build & Test Commands

### Lint (ESLint)
npm install eslint --save-dev
npx eslint popup.js --fix

### 測試 (手動)
1. 載入擴充功能
2. 自動生成 HKID
3. 點擊號碼複製並生成新號碼
4. 在歷史中輸入備註
5. 測試搜尋、匯出/匯入
6. 確認 storage 正常運作

## Code Style Guidelines

### HTML (popup.html)
- 使用語義化標籤 (button, input, section)
- 保持簡潔，僅包含必要結構
- 加入適當的 aria-label 提升無障礙
- 結構: 生成區 (上方) + 歷史區 (下方，可隱藏)

### CSS (style.css)
- 使用 Flexbox 做單欄佈局
- 變數定義於 :root
- 避免深層嵌套 (最多 3 層)
- 響應式設計 (width: 380px)
- 歷史面板預設顯示

### JavaScript (popup.js)

#### 命名慣例
- 變數/函數: camelCase (e.g., `generateHKID`, `toggleHistory`)
- 常量: UPPER_SNAKE_CASE (e.g., `LETTER_WEIGHTS_OLD = [9, 8]`)
- DOM 元素: 前綴 $ (e.g., `$hkidDisplay`, `$historyList`)

#### 類型規範
- 使用 const/let，避免 var
- 明確類型轉換 (String(), Number())
- 函數參數類型註解 (JSDoc)

#### 錯誤處理
try {
  const result = generateHKID();
} catch (error) {
  console.error('HKID Generation Error:', error);
  showNotification('生成失敗，請重試');
}

#### Chrome Storage API
// 儲存
chrome.storage.local.set({ hkidHistory: records });

// 讀取
chrome.storage.local.get(['hkidHistory'], (result) => {
  const history = result.hkidHistory || [];
});

## Project Conventions

### 檔案結構
hkid-generator/
├── manifest.json       # MV3 配置
├── popup.html          # UI 結構 (垂直佈局)
├── popup.js            # 核心邏輯
├── style.css           # 樣式
└── icons/              # 擴充功能圖示

### Git 提交訊息
feat: 自動生成 HKID，無需點擊按鈕
feat: 簡化介面，移除備註輸入框
feat: 歷史面板預設顯示，可隱藏
feat: 新增清空無備註記錄功能
fix: 修正校驗位計算錯誤
docs: 更新 README

### 代碼審查重點
- [ ] HKID 新舊版校驗算法正確
- [ ] 錯誤處理完善
- [ ] storage 操作異步處理正確
- [ ] 無 console.log 殘留 (除錯用可留)
- [ ] 符合無障礙標準

## Common Tasks

### 使用流程
1. 打開擴充功能 → 自動生成第一個 HKID
2. 點擊號碼 → 複製到剪貼簿 + 自動生成新號碼
3. 輸入備註 → 在歷史列表中直接輸入，Enter 或 blur 儲存
4. 管理歷史 → 隱藏/顯示、搜尋、匯出/匯入、清空

### 搜尋記錄
1. 在搜尋框輸入關鍵字
2. 過濾顯示符合 HKID 或備註的記錄

### 匯出 JSON
1. 按「匯出」按鈕
2. 下載 hkid-history-[日期].json
3. 包含所有記錄 (HKID, 備註, 時間戳)

### 匯入 JSON
1. 按「匯入」按鈕
2. 選擇 JSON 檔案
3. 合併至現有歷史 (不覆蓋)

### 清空功能
- 「清空無備註」: 刪除所有沒有備註的記錄
- 「清空」: 刪除所有歷史記錄

## HKID Algorithm Reference

### 字母索引對照
A=1, B=2, C=3, ..., Z=26
權重係數 = 10 + 字母索引 = 11, 12, 13, ..., 36

### 舊式 HKID (1字母 + 6數字)
格式: A123456(3)
權重: [36, 7, 6, 5, 4, 3, 2]

計算:
Sum = 9×36 + 8×(10+字母索引) + Σ(數字×權重 7→2)
Remainder = Sum % 11
CheckDigit:
  - 0 → 0
  - 11-0=11 → A
  - 其他 → 11 - Remainder

### 新式 HKID (2字母 + 6數字)
格式: AD123456(3)
權重: [11+Index(A), 11+Index(D), 7, 6, 5, 4, 3, 2]

計算:
Sum = 9×(10+AIndex) + 8×(10+DIndex) + Σ(數字×權重 7→2)
Remainder = Sum % 11
CheckDigit: 同上

### 範例
A284457: Sum = 9×36 + 8×(10+1) + 2×7 + 8×6 + 4×5 + 4×4 + 5×3 + 7×2
= 324 + 88 + 14 + 48 + 20 + 16 + 15 + 14 = 539
539 % 11 = 0 → CheckDigit = 0 (例)

## Data Structure

### 單筆記錄
{
  "id": "uuid-timestamp",
  "hkid": "A123456(3)",        // 或 "AD123456(3)"
  "format": "old",             // "old" | "new"
  "remark": "客戶資料",        // 備註內容
  "createdAt": 1704067200000,  // 時間戳
  "letterPart": "A",           // 字母部分 (old: 1個, new: 2個)
  "numberPart": "123456"       // 數字部分
}

### 儲存格式
{
  "hkidHistory": [record1, record2, ...]
}
