# Portfolio

Static portfolio site. No build step, no dependencies. Plain HTML, CSS, and a little JavaScript.

```
index.html          page content
favicon.svg         site icon
assets/css/         styles
assets/js/          scroll spy, reveal, lightbox, copy email
assets/fonts/       EB Garamond (self-hosted)
assets/img/         full-size photos + thumbs/ for the page
```

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository and push this folder to the `main` branch.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. The site goes live at `https://<username>.github.io/<repository>/` after a minute or two.
   Naming the repository `<username>.github.io` serves it at `https://<username>.github.io/` instead.

All paths are relative, so it works under both URL forms.

## Editing

- Text lives in `index.html`. Each achievement is one `<article class="card">`.
- To add a photo, create a full-size copy (about 1800 px wide) in `assets/img/` and a thumbnail (about 900 px wide) in `assets/img/thumbs/`, then copy an existing `<figure>` block. Set `--ar` to width divided by height.
- Re-save photos without EXIF data before adding them (phone photos embed GPS location and device details).
