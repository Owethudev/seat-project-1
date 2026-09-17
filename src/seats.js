const seats = Array.from({ length: 20 }, (_, index) => ({
  number: index + 1,
  status: "available",
  email: null,
  holdCode: null,
  expiresAt: null,
  extensions: 0
}));

module.exports = {
  seats
};
