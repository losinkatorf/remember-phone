Remember the number

Simple web app for training own memory remembering a list of phones.
Just static content html. css, js. No server part. Data is stored in browser


Main screen:
Crud for list of phones (form for adding and editing)
two fields per phone: number and description


Self-test screen:
in random order asks to enter the phone by description
checks the digits sequence, ignoring dashes, pluses, etc
Shows wrong/write and shows which digits were wrong.

Stats page:
  sh0ws list of attempts with data and percentage in descending order (newer is higreh)


  Use large fonts, controls, optimize ui for good readability, comforability.


  Add ability to export/import phone liast with results to josn


Add theming (togglable white/dark, get os theme with mediarequest)

writs clean separated code:
custom css in separate file (use some basics from existing css frameworkd)
js:
    logic.js
    data.js
    ui.js
