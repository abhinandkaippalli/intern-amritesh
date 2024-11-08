const express = require("express");
const { processPayment } = require("../controllers/paymentController");
const router = express.Router();

// Route to process payment details
router.post("/process", processPayment);

module.exports = router;
