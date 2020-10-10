const jwt = require("express-jwt");
const { secret } = require("../default.json");
const db = require("../db");

module.exports = authorize;

function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    jwt({ secret, algorithms: ["HS256"] }),

    async (req, res, next) => {
      const user = await db.User.findById(req.user.id);
      const refreshTokens = await db.RefreshToken.find({ user: user._id });

      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user.role = user.role;
      req.user.ownsToken = (token) =>
        !!refreshTokens.find((x) => x.token === token);
      next();
    },
  ];
}
