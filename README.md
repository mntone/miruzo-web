# miruzo-web

[![License under GPLv3](https://forthebadge.com/api/badges/generate?panels=2&primaryLabel=LICENSE&secondaryLabel=GPL+3%2B&primaryBGColor=%23555555&primaryTextColor=%23FFFFFF&secondaryBGColor=%23007ec6&secondaryTextColor=%23FFFFFF&primaryFontSize=12&primaryFontWeight=300&primaryLetterSpacing=2&primaryFontFamily=Montserrat&primaryTextTransform=uppercase&secondaryFontSize=12&secondaryFontWeight=900&secondaryLetterSpacing=2&secondaryFontFamily=Montserrat&secondaryTextTransform=uppercase&secondaryIconColor=%23FFFFFF&secondaryIconSize=24&secondaryIconPosition=right)](./LICENSE)
[![Made with Vite](https://forthebadge.com/api/badges/generate?panels=2&primaryLabel=MADE+WITH&secondaryLabel=Vite&primaryBGColor=%23ef4041&primaryTextColor=%23FFFFFF&secondaryBGColor=%23c1282d&secondaryTextColor=%23FFFFFF&primaryFontSize=12&primaryFontWeight=300&primaryLetterSpacing=2&primaryFontFamily=Montserrat&primaryTextTransform=uppercase&secondaryFontSize=12&secondaryFontWeight=900&secondaryLetterSpacing=2&secondaryFontFamily=Montserrat&secondaryTextTransform=uppercase&secondaryIcon=vite&secondaryIconColor=%23FFFFFF&secondaryIconSize=24&secondaryIconPosition=right)](https://vite.dev/)
[![Written by TypeScript](https://forthebadge.com/api/badges/generate?panels=2&primaryLabel=WRITTEN+BY&secondaryLabel=TypeScript&primaryBGColor=%238fc965&primaryTextColor=%23FFFFFF&secondaryBGColor=%23419b5a&secondaryTextColor=%23FFFFFF&primaryFontSize=12&primaryFontWeight=300&primaryLetterSpacing=2&primaryFontFamily=Montserrat&primaryTextTransform=uppercase&secondaryFontSize=12&secondaryFontWeight=900&secondaryLetterSpacing=2&secondaryFontFamily=Montserrat&secondaryTextTransform=uppercase&secondaryIcon=typescript&secondaryIconColor=%23FFFFFF&secondaryIconSize=24&secondaryIconPosition=right)](https://www.typescriptlang.org/)

miruzo-web is a Solid.js single-page application for browsing the miruzo photo
archive hosted by the companion `miruzo-core` backend. It provides a responsive,
touch-friendly masonry layout, infinite scrolling for large collections, and a
localized UI that can switch between English and Japanese.


## ✨ Features

- Adaptive layout that automatically switches between grid and masonry modes to
  show photos at the sharpest available resolution.
- Infinite scrolling with batched prefetching to keep navigation smooth on both
  desktop and mobile.
- Solid.js + TypeScript architecture with strict typing, making it easy to add
  new components or integrate with other Miruzo services.
- Full i18n support out of the box (English and Japanese translations ship by
  default).

## 🚀 Setup

Follow these steps to run miruzo-web locally.

### Requirements
- Node.js 25 or newer (use the latest stable version listed in `.nvmrc`; this
  project tracks current stable releases rather than LTS)
- Git

### Steps
1. Clone the repository, and install dependencies  
   `git clone https://github.com/mntone/miruzo-web.git && cd miruzo-web && npm install`
2. Start the development server  
   Run `npm run dev` and open the provided URL in your browser.

### Common commands
- `npm run build`: Runs type checking and builds the app.
- `npm run preview`: Serves the production build locally.
- `npm run test`: Runs type check, lint, tests, and build to verify changes.


## 🖱️ Usage

1. Launch the dev server (`npm run dev`) or open the hosted build in your
   browser.
2. Make sure the miruzo backend (miruzo-core) is running and that the frontend
   can reach its REST API endpoint (configure via `.env*` if needed).
3. Browse, filter, and load more photos with the on-screen controls. Favorite or
   score actions will sync through the configured API.


## ⚙️ Configuration

- Backend endpoint: set `VITE_API_BASE_URL` (and other variables documented in
  `.env.example`) in [`.env.development`](./.env.development) and
  [`.env.production`](./.env.production) so the frontend can reach your
  miruzo-core instance. The app is bundled with Vite, so `VITE_*` variables are
  exposed at build time.


## 🌐 Browser support

- Primary verification targets: latest stable and previous stable (n-1)
  releases.
- Feature-based minimum versions:
  - Chrome 108+
  - Firefox 101+
  - Safari 15.4+
  - iOS 15.4+
- See [docs/browser-support.md](./docs/browser-support.md) for the
  feature list and update process.


## 📜 License

This project is licensed under the terms of the GNU General Public License v3.0 (GPLv3).
See the [`LICENSE`](./LICENSE) file for full details.

You are free to use, modify, and distribute this software under the terms of the GPL,
provided that any derivative work is also distributed under the same license.


## 🤝 Contributing

Interested in contributing? See [`CONTRIBUTING.md`](./CONTRIBUTING.md).


## 🔗 Related Projects

- [miruzo-core](https://github.com/mntone/miruzo-core) — FastAPI/SQLModel backend
- [gataku](https://github.com/mntone/gataku) — Source asset repository used by the importer


## 👤 Contact

miruzo-core is developed and maintained by *mntone*.

- GitHub: https://github.com/mntone
- Mastodon: https://mstdn.jp/@mntone
- X: https://x.com/mntone
