# Moheen Sulehria — Portfolio Website

A responsive black-and-gold portfolio with CSS 3D visuals, an optional Three.js background, light/dark mode, scroll reveals, searchable/filterable project cards, résumé download, and an email-client contact form.

## Files

- `index.html` — public portfolio
- `css/style.css` — visual theme and responsive styles
- `js/script.js` — interactions, animations, filters, theme, contact form, Three.js scene
- `admin.html` — content editor and optional GitHub publishing UI
- `js/admin.js` / `css/admin.css` — admin panel behavior and styling
- `data/site-content.json` — content values the public site loads
- `assets/Moheen_Sulehria_Resume.pdf` — generated résumé based only on details provided
- `assets/images/moheen.jpg` — add your own profile photo here (not included yet)

## Run locally

Some browsers block `fetch()` from a `file://` URL. Run the folder using one of these options:

1. VS Code: install **Live Server**, right-click `index.html`, choose **Open with Live Server**.
2. Python (from this folder): `python -m http.server 8000`, then visit `http://localhost:8000`.

## Update the site

### Local/manual update

Open `admin.html` through the same local server. Edit the profile and featured SDLC content, then choose **Download JSON backup**. Replace `data/site-content.json` in your project with the downloaded file and commit/push the change.

### Publish from the admin panel

1. Push this folder to your portfolio GitHub repository.
2. In GitHub repository Settings → Pages, enable deployment from your chosen branch (typically `main`, root folder).
3. Open the deployed `admin.html` page. Enter the GitHub owner, repository name, and actual branch.
4. Create a **fine-grained personal access token** limited to this repository and grant only **Contents: Read and write**. Do not grant Administration or workflow permissions.
5. Paste the token in the password field, tick the acknowledgement, and click **Publish content to GitHub**. The page commits only `data/site-content.json`. The token field is cleared after the attempt and the token is never saved to localStorage or written into project files.
6. GitHub Pages updates after the deployment finishes.

### Security caveat

GitHub Pages is static hosting, so it cannot itself provide a private server-authenticated admin panel. This admin page is a convenience tool, not a substitute for a protected CMS. Anyone who has a valid token can use it while that token is available. Never commit a token or put one in JavaScript source. For a production CMS, use a dedicated CMS/OAuth backend. Revoke the token from GitHub settings when no longer needed.

## Profile photo

Copy your chosen image to `assets/images/moheen.jpg`. The site automatically switches from the initials placeholder to your photo.

## Résumé

The supplied résumé PDF uses only the provided name, degree, skills, email, GitHub, LinkedIn, and SDLC concept. It intentionally does not invent phone numbers, dates, employers, certifications, or project results. Replace it with your final résumé when ready.

## Contact form limitation

The form validates the visitor's name, email, and message, then opens their email application with a prepared draft addressed to `moheensulehria@gmail.com`. It does not submit messages to a server. For fully in-site submissions, connect a form provider or a secure backend.

## Notes

- Replace placeholder/example project information as your projects become real and publicly demo-able.
- GitHub repository cards are curated rather than auto-imported so unrelated repositories aren't misrepresented as featured work. Add real project links after choosing which repositories to feature.
- External font and Three.js CDN assets need an internet connection; CSS animations remain as a visual fallback.
