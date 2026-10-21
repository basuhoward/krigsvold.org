# The Count of Krigsvold

Astro static site for https://krigsvold.org. It consumes the published
`@krigsvold/theme@2.0.0` foundations and `@krigsvold/astro@1.0.0` layout.
Roboto is the body and interface font, Roboto Slab supplies serif and display
roles, and Roboto Mono supplies the public monospace role. All fonts are local.

Use Node 24 or later:

```sh
npm ci
npm run dev
npm run validate
npm run test:browser # first install Chromium: npx playwright install chromium
```

Production output is `dist/`. GitHub Pages builds with Node, and Cloudflare's
Wrangler configuration serves that directory. The old `bundle exec rake build`
command remains a compatibility adapter for existing hosting settings: it runs
npm and Astro and mirrors the output to `_site/`. It does not render Jekyll.
Ruby dependencies and the former templates are retained as migration references;
new hosting configurations should use `npm run build` directly.

## Editing content

Existing Markdown, YAML data, and image paths remain authoritative. Add pages
at the root, news under `_posts`, fellowship profiles under `_fellows`, and
positions under `_positions`. Front matter controls metadata and explicit
permalinks. `src/lib/content.mjs` reads those sources and renders their known
figure includes and collection listings natively; unsupported template syntax
fails the build. New layouts and components belong in `src/`.

The existing canonical URLs, privacy redirects, named headings, feeds, sitemap,
search index, identity artwork, and analytics consent controls are preserved.
Search bundles Fuse locally and inserts result text through DOM APIs. The
original consent controller is reused unchanged; analytics waits for consent
and respects Global Privacy Control.

## Verification

`npm run validate` checks Astro types, content contracts, all source routes,
metadata, local assets, anchors, search entries, and local font exports. Browser
checks exercise responsive pages, navigation, search, native FAQ controls,
consent, withdrawal, Global Privacy Control, and use without JavaScript. They
stub Google Analytics so test traffic never reaches the service.

For the migration PR, CI independently builds the original Jekyll revision and
compares every legacy HTML route, main text, title, description, canonical URL,
and previously working local reference against Astro. Screenshots and the route
inventory are attached to the workflow run for review.
