# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added
- Initial release
- HKID generation supporting old (1 letter) and new (2 letters) formats
- Automatic checksum validation
- History management with Chrome local storage
- Remarks/notes support for each record
- Export/Import history as JSON
- Search functionality
- Auto-copy on click
- History panel with show/hide toggle

### Features
- Automatic HKID generation on extension open
- Click to copy and auto-generate new number
- Edit remarks directly in history panel
- Clear empty records (records without remarks)
- Responsive and clean UI design

### Technical
- Chrome Extension Manifest V3
- Vanilla JavaScript (no external dependencies)
- CSS variables for theming
- XSS protection with HTML escaping
- Proper error handling for storage operations
