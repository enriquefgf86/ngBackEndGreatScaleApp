var jsonWebToken = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

// =========================================================================
// Middleware para tratar con los usuarios y sus tokens mediante verificacion
// =========================================================================
exports.verifyToken = function (request, response=response, next) {
  var token = request.query.token;
  jsonWebToken.verify(token, SEED, (error, decoded) => {
    if (error) {
      return response.status(401).json({
        ok: false,
        message: "unauthorized token expired ",
        errorType: error,
      });
    }
    request.user=decoded.user
    next();

    // response.status(201).json({
    //   ok: true,
    //   message: "User created",
    //   decoded: decoded,
    // });
  });
};
