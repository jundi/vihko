# vihko

Very simple diary application.

## Usage

Install dependencies and start the server:

```bash
npm install
npm start
```

Open `http://localhost:3000` in a browser.

- Create or choose a diary from the front page.
- Shows a calendar for the current month.
- Click a day to create an empty note and select that day.
- Days with a note are highlighted in green.
- The selected day is marked with a black border.
- Click the selected day again to open the note editor.
- Use the previous/next buttons to navigate between months.

Notes are saved per diary on the server in `notes.json`.

## Production Deployment

This app can be deployed as a simple Node.js site:

1. Copy the project to a production server.
2. Install dependencies with `npm install`.
3. Start the app with `npm start`.
4. Use a process manager such as `pm2`, `systemd`, or Docker for reliability.
5. Optionally place the server behind a reverse proxy such as Nginx or Apache.

### Example Nginx setup

- Proxy `http://your-domain.com` to `http://127.0.0.1:3000`
- Enable HTTPS with a TLS certificate
- Keep `notes.json` writable by the app user

### Notes

- `notes.json` stores all diary notes on the server.
- Do not commit `node_modules`.
- Ensure the app has permission to read/write `notes.json`.
