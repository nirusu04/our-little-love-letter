# Our Little Love Letter

A scene-by-scene romantic anniversary experience built with React, Vite, Framer Motion, and Lucide React.

## Run locally

1. Install Node.js LTS from https://nodejs.org/ if `node` and `npm` are not available in your terminal.
2. Open this folder in VS Code.
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL Vite prints, usually `http://localhost:5173`.

## Edit the gift

All personal text, dates, photos, memories, coupons, and song settings live in `src/data/loveStory.js`.

- Change your photos: replace the placeholder files in `public/photos/`, then update the `src` values if your filenames differ.
- Change his name: `boyfriendName` and `nickname` in `src/data/loveStory.js`.
- Change the letter: `letter` in `src/data/loveStory.js`.
- Change the anniversary date: `anniversaryDate` in `src/data/loveStory.js`.
- Change the song: put `our-song.mp3` in `public/audio/`, then edit `song.title`, `song.artist`, `song.cover`, `song.audio`, or `song.spotifyUrl`.
- Change coupons: edit the `coupons` array.

The photo placeholders are intentionally simple SVG scrapbook blocks so the experience runs immediately. Replace them with `.jpg`, `.jpeg`, `.png`, or `.webp` files whenever you are ready.

## GitHub and sharing

The private repository is available at https://github.com/nirusu04/our-little-love-letter.

When the gift is ready to share:

1. Open the repository on GitHub and choose **Settings** > **General** > **Change repository visibility** > **Make public**.
2. Open **Settings** > **Pages** and set the source to **GitHub Actions**.
3. Push the latest changes or run the `Deploy to GitHub Pages` workflow from the **Actions** tab.
4. Share the Pages URL shown by the workflow, usually `https://nirusu04.github.io/our-little-love-letter/`.

The repository itself is private now, so its code and any personal photos remain private until you change the visibility.
