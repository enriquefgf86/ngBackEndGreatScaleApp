// //=================================================================
// //Esta seria la ruta principal de la cual se deslindan las demas
// //previamente estaba en el archivo app.js, pero a manera de modularizar y segmentar
// // todo se procede a crearla en un fiel separado llamdo routes en este archivo
// // llamdo app.js
// //======================================================================

// // =======================================================================
// // Al igual que en el root app es necesario importar express node para establecer
// // la fucnionalidad del backend de node
// // =======================================================================
// var express = require("express");
// var cryptoPaswword = require("bcryptjs");
// var jsonWebToken = require("jsonwebtoken");

const { Router } = require("express");
const router = Router();
const { loginUser ,loginUserGoogle} = require("../controllers/login");
const { check } = require("express-validator");
const { fieldValidator } = require("../middleware/validationFields");

//muy util para validar campos y demas en el back

router.post(
  "/",
  [
    check('email','Email is obligatory').isEmail(),
    check('password','Password is Obligatory').not().isEmpty(),
    fieldValidator
  ],
  loginUser
);


router.post(
  "/google",
  [
    check('token','Token is neccesary').not().isEmpty(),
     fieldValidator
  ],
  loginUserGoogle
);//ruta especoificada para el usuario que desee autentificarse mediante google
//=======================================================================
//inicializando variables express
//========================================================================
// var app = express();

// var User = require("../models/user");
// // const user = require("../models/user");
// var SEED = require("../config/config").SEED;

// // ===========================================================================
// // Estableciendo la ruta para obtener la data de esta ruta obteniendo
// //todos los usuarios
// // ===========================================================================
// app.post("/", (request, response, next) => {
//   var body = request.body;

//   User.findOne({ email: body.email }, (error, userAuth) => {
//     if (error) {
//       return response.status(500).json({
//         ok: false,
//         message: "Error in finding User to  Database",
//         errorType: error,
//       });
//     }

//     if (!userAuth) {
//       return response.status(400).json({
//         ok: false,
//         message: "Error Incorrect Credentials -email",
//         errorType: error,
//       });
//     }
//     if (!cryptoPaswword.compareSync(body.password, userAuth.password)) {
//       return response.status(400).json({
//         ok: false,
//         message: "Error Incorrect Credentials -password",
//         errorType: error,
//       });
//     }
//     userAuth.password = ":)";
//     var userToken = jsonWebToken.sign({ user: userAuth }, SEED, {
//       expiresIn: 14400,
//     }); //4 horas de duracion del token 14400

//     response.status(200).json({
//       ok: true,
//       message: "login works ",
//       userSigned: userAuth,
//       idUser: userAuth._id,
//       tokenUser: userToken,
//     });
//   });
// });

module.exports = router;
