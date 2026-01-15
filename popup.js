// HKID Generator Chrome Extension
// Core logic for generating and managing HKID records

// Constants
const LETTER_WEIGHTS_OLD = [9, 8];
const LETTER_WEIGHTS_NEW = [9, 8];
const DIGIT_WEIGHTS = [7, 6, 5, 4, 3, 2];

// DOM Elements
const $hkidDisplay = document.getElementById('hkidDisplay');
const $toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
const $toggleIcon = document.getElementById('toggleIcon');
const $historyCollapse = document.getElementById('historyCollapse');
const $searchInput = document.getElementById('searchInput');
const $exportBtn = document.getElementById('exportBtn');
const $importBtn = document.getElementById('importBtn');
const $importFile = document.getElementById('importFile');
const $clearEmptyBtn = document.getElementById('clearEmptyBtn');
const $clearHistoryBtn = document.getElementById('clearHistoryBtn');
const $historyList = document.getElementById('historyList');

// Store current HKID (without brackets for display)
let currentHKID = '';

// Utility functions
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generate random HKID alphabet
 */
const generateRandomAlphabet = () => String.fromCharCode(getRandomInt(65, 90));

/**
 * Generate 6-digit random number
 */
const generateRandomNumber = () => {
  let number = '';
  for (let i = 0; i < 6; i++) {
    number += String(getRandomInt(0, 9));
  }
  return number;
};

/**
 * Calculate check digit for HKID
 */
const calculateCheckDigit = (charPart, numPart) => {
  if (charPart.length > 2 || numPart.length !== 6) {
    throw new Error('Invalid HKID format');
  }

  const strValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let checkSum = 0;

  if (charPart.length === 2) {
    checkSum += LETTER_WEIGHTS_NEW[0] * (10 + strValidChars.indexOf(charPart.charAt(0)));
    checkSum += LETTER_WEIGHTS_NEW[1] * (10 + strValidChars.indexOf(charPart.charAt(1)));
  } else {
    checkSum += LETTER_WEIGHTS_OLD[0] * 36;
    checkSum += LETTER_WEIGHTS_OLD[1] * (10 + strValidChars.indexOf(charPart));
  }

  for (let i = 0, j = DIGIT_WEIGHTS.length - 1; i < numPart.length; i++, j--) {
    checkSum += DIGIT_WEIGHTS[i] * parseInt(numPart.charAt(i));
  }

  const remaining = checkSum % 11;
  const verify = remaining === 0 ? 0 : (11 - remaining === 10 ? 'A' : 11 - remaining);

  return verify;
};

/**
 * Generate random HKID
 */
const generateHKID = () => {
  try {
    const hkidMode = getRandomInt(1, 10);
    const isNewFormat = hkidMode === 10;

    let randomAlphabet = generateRandomAlphabet();
    if (isNewFormat) {
      randomAlphabet += generateRandomAlphabet();
    }

    const randomNumber = generateRandomNumber();
    const checkDigit = calculateCheckDigit(randomAlphabet, randomNumber);

    // Format with brackets (for storage/copy)
    const hkidWithBrackets = randomAlphabet + randomNumber + '(' + checkDigit + ')';
    // Format without brackets (for display)
    const hkidWithoutBrackets = randomAlphabet + randomNumber + checkDigit;

    return {
      hkid: hkidWithBrackets,
      hkidDisplay: hkidWithoutBrackets,
      format: isNewFormat ? 'new' : 'old',
      letterPart: randomAlphabet,
      numberPart: randomNumber,
      checkDigit
    };
  } catch (error) {
    console.error('HKID Generation Error:', error);
    throw new Error('生成失敗，請重試');
  }
};

/**
 * Generate UUID for record ID
 */
const generateId = () => {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

/**
 * Load history from Chrome storage
 */
const loadHistory = async () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['hkidHistory'], (result) => {
      resolve(result.hkidHistory || []);
    });
  });
};

/**
 * Save history to Chrome storage
 */
const saveHistory = async (history) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ hkidHistory: history }, resolve);
  });
};

/**
 * Add new HKID record to history
 */
const addToHistory = async (hkidData, remark = '') => {
  const history = await loadHistory();

  const record = {
    id: generateId(),
    hkid: hkidData.hkid,
    hkidDisplay: hkidData.hkidDisplay,
    format: hkidData.format,
    remark: remark.trim(),
    createdAt: Date.now(),
    letterPart: hkidData.letterPart,
    numberPart: hkidData.numberPart
  };

  history.unshift(record);

  if (history.length > 100) {
    history.splice(100);
  }

  await saveHistory(history);
  return record;
};

/**
 * Update remark for a record
 */
const updateRemark = async (recordId, remark) => {
  const history = await loadHistory();
  const record = history.find(r => r.id === recordId);

  if (record) {
    record.remark = remark.trim();
    await saveHistory(history);
  }
};

/**
 * Delete record from history
 */
const deleteRecord = async (recordId) => {
  const history = await loadHistory();
  const filteredHistory = history.filter(r => r.id !== recordId);
  await saveHistory(filteredHistory);
};

/**
 * Clear all history
 */
const clearHistory = async () => {
  await saveHistory([]);
};

/**
 * Clear records without remarks
 */
const clearEmptyRecords = async () => {
  const history = await loadHistory();
  const filteredHistory = history.filter(r => r.remark && r.remark.trim() !== '');
  await saveHistory(filteredHistory);
};

/**
 * Render history list
 */
const renderHistory = (history) => {
  $historyList.innerHTML = '';

  const $historyCount = document.querySelector('.history-header h2');
  if ($historyCount) {
    $historyCount.textContent = `歷史記錄 (${history.length})`;
  }

  if (history.length === 0) {
    $historyList.innerHTML = '<div class="no-records">暫無記錄</div>';
    return;
  }

  history.forEach(record => {
    const item = document.createElement('div');
    item.className = 'history-item';

    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString('zh-HK', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    item.innerHTML = `
      <div class="hkid" data-hkid="${record.hkid}">${record.hkidDisplay}</div>
      <div class="remark-row">
        <input type="text" class="remark-input" data-id="${record.id}" value="${record.remark || ''}" placeholder="輸入備註...">
        <button class="btn-save" data-id="${record.id}">儲存</button>
      </div>
      <div class="meta">
        <span class="timestamp">${formatTime(record.createdAt)}</span>
        <div class="actions">
          <button class="delete" data-id="${record.id}">刪除</button>
        </div>
      </div>
    `;

    // Click to copy
    const hkidElement = item.querySelector('.hkid');
    hkidElement.addEventListener('click', () => {
      navigator.clipboard.writeText(record.hkid);
      showNotification('已複製到剪貼簿');
    });

    // Save button
    const saveBtn = item.querySelector('.btn-save');
    saveBtn.addEventListener('click', () => {
      const input = item.querySelector('.remark-input');
      updateRemark(record.id, input.value.trim());
      showNotification('備註已儲存');
    });

    // Delete button
    const deleteBtn = item.querySelector('.delete');
    deleteBtn.addEventListener('click', () => {
      if (confirm('確定要刪除這筆記錄嗎？')) {
        deleteRecord(record.id).then(refreshHistory);
      }
    });

    $historyList.appendChild(item);
  });
};

/**
 * Filter history based on search term
 */
const filterHistory = (history, searchTerm) => {
  if (!searchTerm.trim()) return history;

  const term = searchTerm.toLowerCase();
  return history.filter(record =>
    record.hkid.toLowerCase().includes(term) ||
    record.hkidDisplay.toLowerCase().includes(term) ||
    record.remark.toLowerCase().includes(term)
  );
};

/**
 * Refresh history display
 */
const refreshHistory = async () => {
  const history = await loadHistory();
  const searchTerm = $searchInput.value;
  const filteredHistory = filterHistory(history, searchTerm);
  renderHistory(filteredHistory);
};

/**
 * Show notification message
 */
const showNotification = (message) => {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const notification = document.createElement('div');
  notification.className = 'toast';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 200);
  }, 2000);
};

/**
 * Export history to JSON file
 */
const exportHistory = async () => {
  const history = await loadHistory();
  const dataStr = JSON.stringify(history, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `hkid-history-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Import history from JSON file
 */
const importHistory = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedHistory = JSON.parse(e.target.result);
        if (!Array.isArray(importedHistory)) {
          throw new Error('Invalid JSON format');
        }

        const currentHistory = await loadHistory();
        const mergedHistory = [...currentHistory, ...importedHistory];

        const uniqueHistory = mergedHistory
          .filter((record, index, self) =>
            index === self.findIndex(r => r.hkid === record.hkid && r.createdAt === record.createdAt)
          )
          .sort((a, b) => b.createdAt - a.createdAt);

        await saveHistory(uniqueHistory);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};

/**
 * Create new HKID
 */
const createNewHKID = async () => {
  try {
    const hkidData = generateHKID();
    currentHKID = hkidData.hkidDisplay;
    $hkidDisplay.textContent = hkidData.hkidDisplay;
    $hkidDisplay.classList.add('has-value');

    await addToHistory(hkidData, '');
    refreshHistory();
  } catch (error) {
    $hkidDisplay.textContent = error.message;
  }
};

/**
 * Toggle history collapse
 */
const toggleHistory = () => {
  const isCollapsed = $historyCollapse.classList.contains('collapsed');
  if (isCollapsed) {
    $historyCollapse.classList.remove('collapsed');
    $toggleIcon.setAttribute('d', 'M6 9l6 6 6-6');
  } else {
    $historyCollapse.classList.add('collapsed');
    $toggleIcon.setAttribute('d', 'M18 15l-6-6-6 6');
  }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Click on HKID to copy and generate new one
  $hkidDisplay.addEventListener('click', async () => {
    if (currentHKID) {
      await navigator.clipboard.writeText(currentHKID);
      showNotification('已複製到剪貼簿');
    }
    // Auto-generate new HKID
    await createNewHKID();
  });

  // Toggle history collapse
  $toggleHistoryBtn.addEventListener('click', toggleHistory);

  // Search history
  $searchInput.addEventListener('input', refreshHistory);

  // Export history
  $exportBtn.addEventListener('click', exportHistory);

  // Import history
  $importBtn.addEventListener('click', () => $importFile.click());
  $importFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await importHistory(file);
        refreshHistory();
        showNotification('歷史記錄已匯入');
      } catch (error) {
        showNotification('匯入失敗：' + error.message);
      }
    }
  });

  // Clear empty records (no remarks)
  $clearEmptyBtn.addEventListener('click', async () => {
    if (confirm('確定要清空所有沒有備註的記錄嗎？')) {
      await clearEmptyRecords();
      refreshHistory();
      showNotification('已清空無備註的記錄');
    }
  });

  // Clear all history
  $clearHistoryBtn.addEventListener('click', async () => {
    if (confirm('確定要清空所有歷史記錄嗎？')) {
      await clearHistory();
      refreshHistory();
      showNotification('歷史記錄已清空');
    }
  });

  // Initialize - generate first HKID and show history
  refreshHistory();
  createNewHKID();
});