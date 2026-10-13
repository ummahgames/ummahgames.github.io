# Ummah Games

A welcoming, static landing page for six free browser games at [ummahgames.com](https://ummahgames.com/). Built with HTML, CSS, and a small optional JavaScript enhancement. No build step or package installation is needed.

## Games and routes

| Game | Link | Controls |
| --- | --- | --- |
| Find the Animal | `/find-the-animal/` | Mouse or touch |
| Alien Explorer | `/alien/` | Mouse or touch |
| Dune Arcanum | `/dune-arcanum/` | Mouse or touch |
| Photon Breaker | `/photon/` | Mouse or touch |
| Swipe Slice | `/swipe/` | Mouse or touch |
| Pearls of the Gulf | `/pearls/` | Keyboard arrow keys |

Each card is a standard link to the game’s folder on the same domain. The game links and section navigation work without JavaScript. JavaScript only enhances “Surprise me” to choose a random game.

## Local preview

The workspace contains the landing repository and six sibling game repositories. To preview that structure with the same paths used in production, run from this repository:

```sh
python3 scripts/preview.py
```

Open `http://127.0.0.1:8000/`. The helper serves the landing page at `/` and each sibling game at its folder path. Stop it with Ctrl+C.

To preview only the landing page, use `python3 -m http.server 8000` from this repository. Game links require the sibling repositories or an equivalent hosting setup; they do not resolve in a landing-only server.

## Production hosting

The existing `CNAME` is `ummahgames.com`. Keep the landing repository at the domain root and publish each game at its matching folder path. On GitHub Pages, that means enabling Pages for each corresponding game repository in the same account. Alternatively, a static web host can serve the landing files at the root alongside the six game directories.

Changes to this checkout do not publish automatically until pushed to the existing hosting workflow. Game source files are maintained in their own repositories.

## Design and accessibility

- Cream, teal, and terracotta palette with responsive one-, two-, and three-column layouts.
- Original local SVG logo, oasis illustration, and artwork for all six game cards in `images/art/`.
- Keyboard focus outlines, a skip link, semantic headings, descriptive link names, and reduced-motion support.
- Google Fonts supplies Nunito Sans, with local system fonts as a fallback.
- Game suggestions and contributions are welcome at [MSSHAMIM@PM.me](mailto:MSSHAMIM@PM.me).

Edit `index.html` for content, `styles.css` for presentation, and `script.js` for the optional random-game link. Earlier raster artwork is retained but is no longer used by the landing page.
