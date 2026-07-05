const jwt = require("jsonwebtoken");

const protect = async (
  req,
  res,
  next
) => {
  let token;

  console.log(req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(
      "Bearer"
    )
  ) {
    try {
      token =
        req.headers.authorization.split(
          " "
        )[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = {
        _id: decoded.id,
      };

      console.log("Decoded User:", req.user);
      console.log("Auth Header:", req.headers.authorization);

      next();
    } catch (error) {
      res.status(401).json({
        message: "Not Authorized",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      message: "No Token",
    });
  }
};

module.exports = { protect };