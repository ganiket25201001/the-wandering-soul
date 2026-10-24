# Aniket — The Wandering Journal

A React travel portfolio with a warm scrapbook design, mouse-driven CSS 3D depth, floating PNG postcards, scroll reveals, journal dialogs, and a visitor-selected next destination.

The main journey is a scroll-controlled scenic sequence implemented in React and Canvas. Detailed local landscape images use a slow camera drift, zoom, light effects, and soft crossfades. Desktop and portrait layouts adapt the composition. This is image animation, not a video or a reconstruction of actual travel. It uses no paid video services or API keys. A pause button freezes camera movement, and reduced-motion mode shows local photo postcards instead of the animated canvas. Rendering pauses when the scene is offscreen or unchanged.

Clicking any postcard opens a keyboard-accessible photo-story dialog with two distinct views, thumbnails, previous/next controls, and a matching “What I saw” / “How it felt” passage for each photo. Use arrow keys to navigate and Escape to close. Entries are illustrative creative writing. The next-destination selector uses Lucide Mountain, TreePalm, and Trees icons.

## Run

Install Node.js, then run `npm install` and `npm run dev`. Create a production build with `npm run build`.

## Content

The narrative follows Mumbai, Jaisalmer, Kedarnath, and a K2 dream chapter. Personal travel moments are illustrative; no completed expedition is claimed. Destination choices are saved only in the visitor's browser using localStorage, without a shared vote database.

## Images

All displayed images are local PNG files in `public/images`.

- `mountains.png`: AI-generated artistic composite of desert and mountain scenery; not a documentary image of K2.
- `jaisalmer.png`: AI-generated illustrative Jaisalmer scene.
- `mumbai.png`: photograph by Prado on Unsplash, https://unsplash.com/photos/people-walking-on-arch-gate-during-daytime-5EI5JYMSvj8 ; downloaded from https://images.unsplash.com/photo-1598434192043-71111c1b3f41 and converted to PNG.
- `kedarnath.png`: Unsplash destination photograph, https://images.unsplash.com/photo-1712733900711-d0b929d0d7cc ; discovered through https://unsplash.com/s/photos/kedarnath and converted to PNG.
- `mumbai-evening.png`, `jaisalmer-dunes.png`, `kedarnath-valley.png`, and `karakoram-dream.png`: AI-generated editorial landscape illustrations created for this project. These are imagined scenes, not documentary records of Aniket's trips.

Google Fonts provide Manrope, DM Sans, and Caveat; system fallback fonts work when offline. Icons are from Lucide. The layout supports mobile screens and reduced-motion preferences.
