const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: true, message: "Access token required" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: true, message: "Invalid token" });

    console.log("Decoded User Role:", decoded.role);  // Check if the role is decoded correctly
    req.user = decoded;  // req.user should have { _id: userId, role: userRole }
    
    next();
  });
}

module.exports = {
  authenticateToken,
};
