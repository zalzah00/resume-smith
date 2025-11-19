Place Inter font woff2 files here to use the bundled local font:

- Inter-Regular.woff2 (400)
- Inter-Medium.woff2  (500)
- Inter-SemiBold.woff2 (600)
- Inter-Bold.woff2 (700)

If these files are present at `/public/fonts/...`, the app will load the local font and avoid external Google Fonts requests. If they are missing, the app falls back to system fonts.

Where to get them:
- Download Inter woff2 files from https://rsms.me/inter/ or from Google Fonts (convert to woff2), and place the files above in this folder.

Note for development:
- After adding the files, restart the dev server or hard-refresh the browser to see the font changes.
