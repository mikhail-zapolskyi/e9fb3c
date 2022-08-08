const jwt = require("jsonwebtoken");
const { User } = require("./db/models");

function notFound(req, res) {
  res.status(404);
  res.json({
    error: "The route is not defined",
  });
}

/* eslint-disable-next-line no-unused-vars */
function errorHandler(err, req, res, next) {
     let message = err.message;
     const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

     if(err.name = 'SequelizeValidationError'){
          message = err.errors.map(e => e.message);
          req.statusCode = 401;
     }

     res.status(statusCode);
     res.json({
          message,
          stack: process.env.NODE_ENV === "production" ? "" : err.stack,
     });
}

/* eslint-disable-next-line no-unused-vars */
function auth(req, res, next) {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return next();
      }
      User.findOne({
        where: { id: decoded.id },
      })
        .then((user) => {
          if (!user) {
            throw new Error("No user found with provided token");
          }
          req.user = user;
          return next();
        })
        .catch(() => {
          next();
        });
    });
  } else {
    return next();
  }
}

module.exports = {
  notFound,
  errorHandler,
  auth,
};
