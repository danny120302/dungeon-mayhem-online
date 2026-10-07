# Dungeon Mayhem Online

Node.js + Socket.IO multiplayer version of the current Dungeon Mayhem web game.

## Local

```bash
npm install
npm start
```

Open http://localhost:3000

## Render

Create a Render Web Service from this repository.
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`

The server listens on `0.0.0.0` and uses Render's `PORT` environment variable.

The browser uses `io()` so Socket.IO automatically connects to the deployed site's origin.
