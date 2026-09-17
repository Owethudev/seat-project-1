const express = require("express");
const { seats } = require("./src/seats");

const app = express();
const PORT = process.env.PORT || 3000;

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

  seat.email = email;
  seat.holdCode = holdCode;
  seat.status = "held";

  return res.status(201).json({
    holdCode,
    seatNumber: seat.number,
    email: seat.email,
    status: seat.status
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
