# Artha Portfolio

Personal portfolio foundation for Artha, built with React, Vite, Tailwind CSS v4, and Motion.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build` and serve it locally with `npm run preview`.

## Dependencies

- React and React DOM render the single-page site.
- Vite and its React plugin provide the dev server and production build.
- Tailwind CSS v4 is configured through its Vite plugin; detailed visual styling stays in `src/styles.css`.
- Motion powers the resizable glass navigation and active-section indicator. No timeline animation library is included in this foundation; the P1 intro curtain is deferred.

## Content and assets

- Contact destinations and the WhatsApp number live in `src/data/site.js`. Keep them empty until Artha verifies the details.
- Project entries live in `src/data/site.js`. Add factual fields and real preview files only after they are supplied and verified.
- Add licensed Latin variable font files as `public/fonts/sora-latin-variable.woff2` and `public/fonts/inter-latin-variable.woff2`; then add `@font-face` rules with `font-display: swap` to `src/styles.css` and preload only Sora in `index.html`. Until then, the CSS uses installed Sora/Inter fonts if available and otherwise falls back to Arial.
- Replace the labelled Ruma preview placeholder with a real project screenshot before presenting it as visual evidence.
- Add the current CV PDF and a portrait if Artha wants those assets published.

## Vercel

Import this project into Vercel and use the default Vite build settings. The production output is `dist/`.
