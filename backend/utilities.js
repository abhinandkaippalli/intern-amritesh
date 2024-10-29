const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: true, message: "Access token required" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.error("Access token expired");
        return res.status(401).json({ error: true, message: "Token expired" });
      }
      console.error("Token verification failed:", err);
      return res.status(401).json({ error: true, message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

const authorizeRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };

module.exports = {
  authenticateToken,
  authorizeRole,
};
