# Remember the Number - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Application Overview

Remember the Number is a pure client-side web application for memorizing phone numbers through self-testing. It uses HTML5, CSS3, vanilla JavaScript (ES6+), Bootstrap 5 (via CDN), and Canvas API for animations. All data is stored locally in the browser's localStorage, ensuring complete privacy and offline functionality.

## Working Effectively

### Bootstrap and Run the Application
- Clone the repository: `git clone <repository-url>`
- Navigate to the project directory: `cd remember-phone`
- Start a local web server: `python3 -m http.server 8000 --bind 127.0.0.1`
- Open browser to: `http://localhost:8000`
- Application loads instantly (< 1 second startup time)

### Key Files and Architecture
- `index.html` - Main HTML structure with all UI components and sections
- `data.js` - Data management and localStorage operations (phones, stats, import/export)
- `logic.js` - Core application logic including test functionality and answer checking
- `ui.js` - UI updates, language switching, and user interface management
- `style.css` - Custom styling and responsive design
- `background.js` - Canvas-based animated background with blinking digits
- `background.css` - Styling for the animated background
- `translations.js` - Multi-language support (10 languages supported)

### No Build Process Required
- This is a static web application with NO build process
- No package.json, Makefile, or build scripts exist
- No dependencies to install - uses Bootstrap 5 via CDN
- No transpilation, bundling, or compilation steps
- Simply serve the files with any HTTP server

## Validation Scenarios

ALWAYS run through these complete user scenarios after making changes to ensure functionality:

### Phone Number Management Test
- Add a phone number: Enter "+1-555-123-4567" in Phone Number field, "Test Contact" in Description field, click Add/Update
- Verify phone appears in table with edit/delete buttons
- Test edit functionality by clicking edit button, modifying data, and saving
- Test delete functionality by clicking delete button

### Self-Testing Workflow
- Click "Test" button to start self-testing mode
- Verify test shows description and asks for phone number input
- Enter correct phone number and click "Check"
- Verify result shows digit-by-digit correctness feedback and percentage
- Click "Next" to continue or complete test
- Verify "Test Complete!" summary appears with overall score

### Statistics and Data Management
- After completing a test, verify statistics table shows new entry with date, correct count, and percentage
- Click "Export Data" and verify JSON file downloads with phones and stats data
- Test import functionality if making changes to data handling

### Theme and Language Testing
- Toggle dark mode switch and verify theme changes apply
- Change language dropdown and verify all text updates correctly
- Verify theme and language preferences persist on page reload

### Performance and Responsiveness
- Test application responsiveness by resizing browser window
- Verify animated background renders smoothly without performance issues
- Test on different screen sizes to ensure mobile compatibility

## Common Development Tasks

### Modifying Phone Number Logic
- Phone validation and formatting logic is in `logic.js` in the `checkAnswer` function
- Always test with various phone number formats: +1-555-123-4567, (555) 123-4567, 5551234567
- Changes to phone storage format require updating `data.js` functions

### UI and Styling Changes
- Main styling is in `style.css` - uses Bootstrap 5 classes extensively
- Background animations are in `background.js` and `background.css`
- Always test both light and dark modes when making visual changes
- Verify changes work across all language options

### Data Storage Modifications
- All data persistence is handled in `data.js` using localStorage
- Export/import functionality in `data.exportData()` and `data.importData()`
- Always maintain backward compatibility with existing stored data
- Test data persistence across browser sessions

### Translation and Internationalization
- All text strings are in `translations.js` with keys for each supported language
- UI language switching is handled in `ui.js` in `setLanguage` function
- When adding new text, always add translations for all 10 supported languages
- Test language switching preserves application state

## Critical Validation Steps

### Manual Testing Requirements
- ALWAYS test the complete user workflow: add phone → take test → view stats → export data
- Test both correct and incorrect phone number inputs during self-testing
- Verify data persistence by refreshing browser and checking data remains
- Test edge cases: empty phone list, special characters in phone numbers, long descriptions

### Browser Compatibility
- Test in Chrome/Chromium browsers (primary target)
- Verify localStorage functionality works correctly
- Test Canvas animations render properly
- Ensure Bootstrap CSS loads from CDN

### Data Integrity
- Always verify exported JSON contains both phones and stats arrays
- Test that imported data merges correctly with existing data
- Verify statistics calculations are accurate (percentage = correctCount/totalCount * 100)

## Performance Expectations

- Application startup: Instant (< 1 second)
- Phone number addition: Instant
- Test initiation: Instant
- Answer checking: Instant
- Data export: Instant download
- Theme switching: Instant
- Language switching: < 1 second (updates all text elements)

## Repository Structure Reference

```
/
├── index.html              # Main application HTML
├── style.css              # Custom styles  
├── background.css         # Background animation styles
├── background.js          # Canvas background animations
├── data.js               # Data management and localStorage
├── logic.js              # Core application logic and testing
├── ui.js                 # UI management and language switching
├── translations.js       # Multi-language support
├── README.md             # Project documentation
├── implementation-plan.md # Development history
├── screenshots/          # Application screenshots
├── docs/                 # Additional documentation
└── playwright-report/    # Previous test reports

ls -la [repo-root]:
.git .gitignore README.md background.css background.js data.js docs implementation-plan.md index.html logic.js playwright-report screenshots style.css translations.js ui.js
```

## Development Workflow

### Making Changes
- Always start local server: `python3 -m http.server 8000`
- Open application in browser: `http://localhost:8000`
- Make incremental changes to JavaScript, CSS, or HTML files
- Refresh browser to see changes immediately (no build step required)
- Test functionality manually using validation scenarios above

### Code Organization
- Keep data operations in `data.js`
- Keep UI logic in `ui.js` 
- Keep core application logic in `logic.js`
- Keep styling changes in `style.css`
- Always follow the existing modular pattern

### Before Committing Changes
- Run through all validation scenarios manually
- Test both light and dark themes
- Test at least 2 different languages
- Verify data export/import still works
- Check browser console for any JavaScript errors
- Ensure application works in private/incognito mode (tests localStorage isolation)

## Troubleshooting

### Common Issues
- If Bootstrap styles don't load: Check internet connection (uses CDN)
- If localStorage data disappears: Verify not in private/incognito mode
- If animations don't work: Check Canvas API support in browser
- If export doesn't work: Verify browser allows file downloads

### Development Tips
- Use browser developer tools to debug localStorage: Application → Storage → Local Storage
- Monitor console for JavaScript errors when testing new features
- Use browser responsive design mode to test mobile layouts
- Clear localStorage to test fresh application state: `localStorage.clear()` in console