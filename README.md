# Happy Birthday, Mumma!

A bright, Celebration Station-inspired React birthday site with the five family photos, animated confetti, a heartfelt birthday letter, an interactive candle-blowing surprise, a photo viewer/slideshow, and optional ambient music.

## Run it

1. Install Node.js (version 20.19+ or 22.12+).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local address Vite prints.

Music begins only when its button is turned on. The slideshow and photo viewer can be used without music.

## Deploy it

Run `npm run build`, then deploy the generated `dist` folder to a static host such as Netlify or Vercel. Both can also build this project directly with `npm run build` and publish `dist`.

## Make it yours

- Edit the opening message and memories in `src/App.jsx`.
- Replace the pictures in `public/photos/` while keeping the same filenames, or update the `photos` list in `src/App.jsx`.
- The birthday letter is part of the page text in `src/App.jsx`.

Google Fonts are used when available, with elegant system font fallbacks so the site still works without them.
