# Prime UI Review

Standalone review project for three experiences: Business Web, Customer App, Sales App.

- Every customer, product record, transaction and operational figure is fictional.
- No data, credentials, endpoint calls or storage bindings from X-Booster.
- Test login: username `cmc-test`, password supplied separately. No OpenAI sign-in. This browser-only gate is intentionally for synthetic UI testing; static files remain downloadable and session flags can be bypassed. Do not use real data. For production, use server-side authentication.
- Static frontend. Sample interactions and feedback persist only in this browser's localStorage.
- Uploaded images stay as in-memory blob URLs and are never uploaded. Drafts exclude images.
- Review feedback can be exported as JSON. No automatic sending or collaboration sync.
- Chart projections are illustrative scenarios, not AI forecasts or production recommendations.
- App / role switchers are UI demonstrations, not real RBAC. Access is enforced by the private Sites audience.
- No bank transfers, live AI, ERP, customs, actual order processing or notifications are connected.

Only publish this project's own manifest/project ID; never deploy it to X-Booster.

Preview: python3 -m http.server 5184 --directory dist

## GitHub Pages
Serve from the `docs/` folder on the default branch in repository Settings → Pages. All asset paths are relative, including the ES modules. No build or OpenAI API key is required.

The Sites audience setting does not transfer to GitHub Pages. Only the test UI gate applies there; it is not real access control.
