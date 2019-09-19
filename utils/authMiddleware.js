// extract token from headers
const jwt = require("jsonwebtoken");
const secret = require("./keys").secret;

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res.json({ error: "unauthorized" });
  }
  jwt.verify(token, secret, (err, decode) => {
    if (err) {
      return res.status(500).json({ error: "Bad credentials" });
    } else if (decode) {
      req.user = decode;
      next();
    }
  });
};

module.exports = authenticate;
