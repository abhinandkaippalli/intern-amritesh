const { body, validationResult } = require("express-validator");

exports.processPayment = [
  // Validation middleware
  body("email").isEmail().withMessage("Invalid email address"),
  body("mobile").isMobilePhone().withMessage("Invalid mobile number"),
  body("cardDetails").notEmpty().withMessage("Card details are required"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, mobile, cardDetails, amount } = req.body;

    try {
      // Simulated payment processing logic
      const paymentResult = { success: true, transactionId: "TXN123456" };

      if (paymentResult.success) {
        res.json({
          message: "Payment successful",
          transactionId: paymentResult.transactionId,
        });
      } else {
        res.status(400).json({ message: "Payment failed" });
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  },
];
