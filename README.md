# Aniket — The Wandering Journal

A React travel portfolio with a warm scrapbook design, mouse-driven CSS 3D depth, floating PNG postcards, scroll reveals, journal dialogs, and a visitor-selected next destination.

The main journey is now a continuous scroll-controlled perspective world, implemented in React and Canvas. A camera advances through procedural city buildings, sandstone lanes, a temple-inspired mountain scene, and snowy peaks. This is a stylized interpretation, not an accurate reconstruction of the landmarks. It uses no paid video services, API keys, or external 3D libraries. Desktop and portrait layouts share the interactive scene with different compositions; no pre-rendered film is used. A pause button freezes camera movement, and reduced-motion mode shows local photo postcards instead of the animated canvas.

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

Google Fonts provide Manrope, DM Sans, and Caveat; system fallback fonts work when offline. Icons are from Lucide. The layout supports mobile screens and reduced-motion preferences.
