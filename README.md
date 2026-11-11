# POWERSET 1.4 — Performance Analytics

POWERSET is the renamed evolution of FORGE. The visual direction remains original: dark industrial metal, crimson accents, steel tones and a disciplined, epic training atmosphere. It does not use Iron Maiden lyrics, logos or characters.

## What's new
- Brand rename: POWERSET — Personal Training.
- New PERFORMANCE dashboard.
- Training session count, completed sets, total training volume (load × reps), and 7-day frequency.
- Volume by muscle group, using the exercise's muscle profile when available and conservative name-based fallbacks otherwise.
- Weekly frequency chart.
- Body weight and body-fat progression charts from saved assessments.
- Personal best load by exercise.
- Existing exercise library, YouTube links, workouts, history, measurements, rest timer and backup/restore retained.

## Data compatibility
- **Preserves the existing LocalStorage key `forge-metal-v1`** to keep current data.
- Retains the active-session key `forge-active-session-v1`.
- Backup export now uses the POWERSET label; import accepts both POWERSET and legacy FORGE backups.
- No database reset, uninstall, Safari data clearing or storage migration is required.
- Metrics are calculated from recorded completed sets. Old sessions without set-level records may contribute to session counts but not volume or personal records.
- Muscle group assignment uses the muscle field in each exercise profile where present; otherwise it falls back to exercise-name keywords. You can improve classifications by filling the muscle field in the Library.

## GitHub update
Replace only:
- `index.html`
- `css/theme-metal.css`
- `js/app.js`
- `manifest.webmanifest`

Keep `assets/icon.svg` as it is for this release. A new POWERSET icon can be designed as a separate, deliberate visual update. Keep the same repository structure and do not delete any user data.
