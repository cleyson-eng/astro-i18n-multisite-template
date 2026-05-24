# Astro > JC I18N/MultiSite Template

## 🚀 Project Structure

```text
/
├── build-scripts \[+\]/
│   └── i18n.astro - I18N astro element: \<I\>\<Fragment lang="html_code"\>\</Fragment\>...\</I\>
├── public/ - Dont use, in multiple site/root can generate unecessary copies.
├── src
│   ├── assets \[-\]
│   │   └── astro.svg
│   ├── components \[-\]
│   │   └── Welcome.astro
│   ├── layouts \[-\]
│   │   └── Layout.astro
│   ├── pages - Dont use, site map will generate redirects (multiple site infraestruture).
│   ├── pages_redirect \[!\] - Generated with "npm run genremap" (in .gitignore).
│   └── meta \[+\]/ - When edited run "npm run config".
│       ├── languages.json - List site languages.
│       └── sitemap.ts - Must export some const as said in 'build-scripts/sitemap_data.ts'.
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run genremap`        | Update site map structure                        |
| `npm run config`          | Apply i18n languages                             |
| `npm run release`         | Multiple site final release                      |
