# Beginner Ticket Reservation Project

This project is a very simple beginner-level Node.js + Express API.

## Install dependencies

Run this command in the project folder:

```bash
npm install
```

## Start the server

Run:

```bash
npm start
```

The server will start on port 3000 by default.

If port 3000 is already used on your computer, run:

```bash
PORT=3001 npm start
```

Then use the matching port in the health check URL.

## Test the health endpoint

Open this in your browser:

```text
http://localhost:3000/api/health
```

Or run:

```bash
curl http://localhost:3000/api/health
```

If you started the server on another port, replace 3000 with that port.

You should get:

```json
{
  "message": "API is running"
}
```
