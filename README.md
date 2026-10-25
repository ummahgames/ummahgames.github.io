# Ummah Games

A welcoming, static landing page for 57 free browser games at [ummahgames.com](https://ummahgames.com/). Built with HTML, CSS, and a small optional JavaScript enhancement. No build step or package installation is needed.

## Games and routes

The [workspace category index](../README.md) lists the five broad game types. The complete [game library](../GAME_LIBRARY.md) lists all 51 idea games, each with eight levels and its own rules. The six original games are also retained. The earlier routes below remain available; the library includes the 34 newly added games, including Stardust Sanctuary.

| Game | Link | Controls |
| --- | --- | --- |
| Little Delivery Wagon | `/little-delivery-wagon/` | Mouse, touch, or keyboard |
| Sleepy Creature Hotel | `/sleepy-creature-hotel/` | Mouse, touch, or keyboard |
| Puddle Engineers | `/puddle-engineers/` | Mouse, touch, or keyboard |
| Sandcastle Helpers | `/sandcastle-helpers/` | Mouse, touch, or keyboard |
| Picnic Pairs | `/picnic-pairs/` | Mouse, touch, or keyboard |
| Cloud Shepherd | `/cloud-shepherd/` | Mouse, touch, or keyboard |
| Mosaic Courtyard | `/mosaic-courtyard/` | Mouse, touch, or keyboard |
| Carpet Unroll | `/carpet-unroll/` | Mouse, touch, or keyboard |
| Bookworm Caravan | `/bookworm-caravan/` | Mouse, touch, or keyboard |
| Button Burrows | `/button-burrows/` | Mouse, touch, or keyboard |
| Folded Worlds | `/folded-worlds/` | Mouse, touch, or keyboard |
| Orchard Guardians | `/orchard-guardians/` | Mouse, touch, or keyboard |
| Caravan Breakthrough | `/caravan-breakthrough/` | Mouse, touch, or keyboard |
| Clockwork Champions | `/clockwork-champions/` | Mouse, touch, or keyboard |
| The Borrowed Minute | `/the-borrowed-minute/` | Mouse, touch, or keyboard |
| Shadow Architects | `/shadow-architects/` | Mouse, touch, or keyboard |
| Bridgewrights | `/bridgewrights/` | Mouse, touch, or keyboard |
| Find the Animal | `/find-the-animal/` | Mouse or touch |
| Alien Explorer | `/alien/` | Mouse or touch |
| Dune Arcanum | `/dune-arcanum/` | Mouse or touch |
| Photon Breaker | `/photon/` | Mouse or touch |
| Swipe Slice | `/swipe/` | Mouse or touch |
| Pearls of the Gulf | `/pearls/` | Keyboard arrow keys |

Each card is a standard link to the game’s folder on the same domain. The game links and section navigation work without JavaScript. JavaScript adds search, age/type/reading/player/level filters, and a random game chosen from the filtered results.

All 57 linked games include full-screen controls and layouts for computers, tablets, and phones. The icon in each game's header enters fullscreen, with an exit control available during play. Browsers that do not permit native fullscreen use an expanded page view and retain their browser bars. The landing page explains these controls and includes Pearls' touch-joystick support.

## Local preview

The workspace contains the landing repository and 57 game directories inside matching/, puzzles/, strategy/, creative/, and action/. To preview that structure with the same paths used in production, run from this repository:

```sh
python3 scripts/preview.py
```

Open `http://127.0.0.1:8000/`. The helper serves the landing page at `/` and each categorized game at its existing public slug route, for example /orchard-guardians/ maps to strategy/orchard-guardians/. Stop it with Ctrl+C.

To preview only the landing page, use `python3 -m http.server 8000` from this repository. Game links require the categorized source folders or an equivalent hosting setup; they do not resolve in a landing-only server.

## Production hosting

The existing `CNAME` is `ummahgames.com`. Keep the landing repository at the domain root and publish each game at its matching folder path. On GitHub Pages, that means enabling Pages for each corresponding game repository in the same account. Alternatively, a combined static deployment can serve the landing files at the root and copy each game from its category folder to the matching public slug folder. Source categories are an organizational structure; public URLs remain unchanged.

Changes to this checkout do not publish automatically until pushed to the existing hosting workflow. The six original game repositories retain their Git metadata inside the category folders; the toolkit games are distributed from the shared source. The source-folder move does not rename remote repositories or publish changes.

## Design and accessibility

- Cream, teal, and terracotta palette with responsive one-, two-, and three-column layouts.
- Original local SVG logo, oasis illustration, and artwork for all 57 game cards in `images/art/`.
- Keyboard focus outlines, a skip link, semantic headings, descriptive link names, and reduced-motion support.
- Local system fonts provide rounded typography without external font requests.
- Game suggestions and contributions are welcome at [MSSHAMIM@PM.me](mailto:MSSHAMIM@PM.me).

Edit `index.html` for content, `styles.css` for presentation, and `script.js` for search, filters, and the random-game link. Editorial age, reading, play-style, and shared-play guidance comes from `../game-kit/discovery.cjs`, distributed as `game-meta.js`. Age ranges are guidance rather than assessed suitability. Earlier raster artwork is retained but is no longer used by the landing page.

The 49 toolkit game cards are generated between the MINI-GAMES comment markers from `../game-kit/catalog.js`. Change their canonical source there and run `node ../game-kit/build.cjs`; the other cards and landing content are preserved.
