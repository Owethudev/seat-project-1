const express = require("express");
const { seats } = require("./src/seats");

const app = express();
const PORT = process.env.PORT || 3000;

function resetSeat(seat) {
  seat.status = "available";
  seat.email = null;
  seat.holdCode = null;
  seat.expiresAt = null;
}

function isSeatExpired(seat) {
  if (!seat || !seat.expiresAt) {
    return false;
  }

  return Date.now() > seat.expiresAt;
}

function findSeatByHoldCode(holdCode) {
  return seats.find((seat) => seat.holdCode === holdCode);
}

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "API is running"
  });
});

app.get("/api/seats", (req, res) => {
  res.json(seats);
});

app.post("/api/holds", (req, res) => {
  const { email, seatNumber } = req.body;

  if (!email || !seatNumber) {
    return res.status(400).json({
      error: "Email and seat number are required"
    });
  }

  const seat = seats.find((item) => item.number === Number(seatNumber));

  if (!seat) {
    return res.status(404).json({
      error: "Seat not found"
    });
  }

  if (isSeatExpired(seat)) {
    resetSeat(seat);
  }

  if (seat.status !== "available") {
    return res.status(409).json({
      error: "Seat is not available"
    });
  }

  const allowedCharacters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let holdCode = "";

  for (let i = 0; i < 6; i += 1) {
    const randomIndex = Math.floor(Math.random() * allowedCharacters.length);
    holdCode += allowedCharacters[randomIndex];
  }

  const expiresAt = Date.now() + 60000;

  seat.email = email;
  seat.holdCode = holdCode;
  seat.status = "held";
  seat.expiresAt = expiresAt;

  return res.status(201).json({
    holdCode,
    seatNumber: seat.number,
    email: seat.email,
    status: seat.status,
    expiresAt: seat.expiresAt
  });
});

app.post("/api/holds/confirm", (req, res) => {
  const { email, holdCode } = req.body;

  if (!email || !holdCode) {
    return res.status(400).json({
      error: "Email and hold code are required"
    });
  }

  const seat = findSeatByHoldCode(holdCode);

  if (!seat) {
    return res.status(404).json({
      error: "Hold not found"
    });
  }

  if (isSeatExpired(seat)) {
    resetSeat(seat);
    return res.status(409).json({
      error: "Hold has expired"
    });
  }

  if (seat.email !== email) {
    return res.status(403).json({
      error: "Wrong email for this hold"
    });
  }

  if (seat.status === "confirmed") {
    return res.status(200).json({
      message: "Seat already confirmed",
      seatNumber: seat.number,
      email: seat.email,
      holdCode: seat.holdCode,
      status: seat.status
    });
  }

  if (seat.status !== "held") {
    return res.status(409).json({
      error: "Hold is not active"
    });
  }

  seat.status = "confirmed";
  seat.expiresAt = null;

  return res.status(200).json({
    message: "Seat confirmed",
    seatNumber: seat.number,
    email: seat.email,
    holdCode: seat.holdCode,
    status: seat.status
  });
});

app.post("/api/holds/release", (req, res) => {
  const { email, holdCode } = req.body;

  if (!email || !holdCode) {
    return res.status(400).json({
      error: "Email and hold code are required"
    });
  }

  const seat = findSeatByHoldCode(holdCode);

  if (!seat) {
    return res.status(404).json({
      error: "Hold not found"
    });
  }

  if (isSeatExpired(seat)) {
    resetSeat(seat);
    return res.status(409).json({
      error: "Hold has expired"
    });
  }

  if (seat.email !== email) {
    return res.status(403).json({
      error: "Wrong email for this hold"
    });
  }

  resetSeat(seat);

  return res.status(200).json({
    message: "Seat released",
    seatNumber: seat.number,
    status: seat.status
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
