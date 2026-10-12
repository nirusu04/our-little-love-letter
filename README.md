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
