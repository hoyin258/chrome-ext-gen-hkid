# Specification: HKID Generator Chrome Extension

## 1. Project Overview
- **Goal**: Develop a Chrome Extension (Manifest V3) that generates valid Hong Kong Identity Card (HKID) numbers.
- **Primary Function**: When a user clicks a button in the popup, a random but mathematically valid HKID is generated and displayed.

## 2. File Structure
The project should consist of the following files:
- `manifest.json`: Extension configuration (MV3).
- `popup.html`: The user interface.
- `popup.js`: The core logic for HKID generation and UI interaction.
- `style.css`: Basic styling for the popup.

## 3. Core Logic: HKID Algorithm
The AI must implement the following checksum algorithm to ensure the generated ID is valid:
- **Format**: `[Prefix][Numbers]([CheckDigit])` (e.g., A123456(1)).
- **Character Mapping**: A=1, B=2, ..., Z=26.
- **Weighting System**:
    - Leading Letter: Weight 8
    - 1st Digit: Weight 7
    - 2nd Digit: Weight 6
    - 3rd Digit: Weight 5
    - 4th Digit: Weight 4
    - 5th Digit: Weight 3
    - 6th Digit: Weight 2
- **Calculation**:
    1. Sum = (LetterValue * 8) + (D1 * 7) + (D2 * 6) + (D3 * 5) + (D4 * 4) + (D5 * 3) + (D6 * 2).
    2. Remainder = Sum % 11.
    3. If Remainder == 0, CheckDigit = 0.
    4. If Remainder == 1, CheckDigit = 'A'.
    5. Otherwise, CheckDigit = 11 - Remainder.

## 4. UI Requirements
- A clean, small popup window.
- A **"Generate HKID"** button.
- A display area to show the result.
- (Optional) A **"Copy"** button to copy the generated ID to the clipboard.

## 5. Implementation Instructions
1. Initialize `manifest.json` with `action` pointing to `popup.html`.
2. In `popup.js`, create a function `generateHKID()` that implements the algorithm above.
3. Ensure the UI is responsive and user-friendly.
4. Provide a brief instruction on how to load this extension into Chrome via `chrome://extensions/` in Developer Mode.
