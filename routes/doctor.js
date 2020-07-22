//=================================================================
//Esta seria la ruta principal de la cual se deslindan las demas
//previamente estaba en el archivo app.js, pero a manera de modularizar y segmentar
// todo se procede a crearla en un fiel separado llamdo routes en este archivo
// llamdo app.js
//======================================================================

// =======================================================================
// Al igual que en el root app es necesario importar express node para establecer
// la fucnionalidad del backend de node
// =======================================================================
const { Router } = require("express"); //importando express asignandosleea una variable constante llamada Router
//vease que la variable se encierra en parentesis a manera de desagregacion
//en caso de que a futuro se pretendan insertar nuevas constantes en la misma
//linea

const {
  getAllDoctors,
  createADoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctors"); //importando del controlador de usuarios todo lo referente a la ruta
//o cada una de lloas rutas del controller para usario

// const { createADoctor } = require("../controllers/doctors"); //importando del controlador de usuarios todo lo referente a la ruta
// //o cada una de lloas rutas del controller para usario

// const { updateDoctor } = require("../controllers/doctors"); //importando del controlador de usuarios todo lo referente a la ruta
// //o cada una de lloas rutas del controller para usario en este caso la ruta de actualizar usuario

// const { deleteDoctor } = require("../controllers/doctors"); //importando del controlador de usuarios todo lo referente a la ruta
// //o cada una de lloas rutas del controller para usario en este caso la ruta de borrar  usuario

const { check } = require("express-validator"); //importando el middleware check del paquete de express-validator
//muy util para validar campos y demas en el back

const { fieldValidator } = require("../middleware/validationFields"); //importando field validation funcion del midelware creado
//validationField , el mismo se utiliza para ya de antemano tener generadas
//respuestas , lo cual haria menos trabajoso escribir el codigo , pues en la logica
//se escribe simplemente una vez( en la carpeta middle ware en este caso ) y ya
//despues se procederia a importarlo en dondequieres aque se use

//=======================================================================
//inicializando variables express
//========================================================================
const router = Router(); //inicializando la constante Router previamente requerida en este apartado
//de rutas a traves de express

var Doctor = require("../models/doctors");
// var jsonWebToken = require("jsonwebtoken");
const { validateJwt } = require("../middleware/jwtMiddleware");
// var SEED = require("../config/config").SEED;
// var middleware = require("../middleware/authentication.js").verifyToken;

// ===========================================================================
// Estableciendo la ruta para obtener la data de esta ruta obteniendo
//todos los usuarios
// ===========================================================================
router.get("/",validateJwt,  getAllDoctors); //Obtener todos los usuarios

// ===========================================================================
// Estableciendo la ruta para crear un usuario
// ===========================================================================
router.post(
  "/",validateJwt,
  [
    check("name", "name is obligatory").not().isEmpty(),
    check("hospital", "hospital id must be valid").isMongoId(),//validando el id sum,inistrado por mongo como valido

    fieldValidator, //grabando o constatatando no exite ningun error en validacion
    //vease que se debe poner despues de los middle ware de check
  ],
  createADoctor
); //Crear un usuario

//==========================================================================
// Estableciendo la ruta para modificar usuario
// ===========================================================================
router.put(
  "/:id",
  
  [
    check("email", "email is obligatory").isEmail(),
    check("name", "name is obligatory").not().isEmpty(),
    check("role", "role is obligatory").not().isEmpty(),

    fieldValidator, //grabando o constatatando no exite ningun error en validacion
    //vease que se debe poner despues de los middle ware de check
  ],
  updateDoctor
); //Obtener todos los usuarios

//==========================================================================
// Estableciendo la ruta para borrar usuario
// ===========================================================================
router.delete("/:id",  deleteDoctor);

// // ===========================================================================
// // Estableciendo la ruta para modificar o actualizar usuario
// // ===========================================================================
// router.put("/:id", middleware, (request, response, next) => {
//   var id = request.params.id;

//   var bodyUser = request.body;

//   User.findById(id, (error, userFound) => {
//     if (error) {
//       return response.status(500).json({
//         ok: false,
//         message: "Error  in database",
//         errorType: error,
//       });
//     }
//     if (!userFound) {
//       return response.status(404).json({
//         ok: false,
//         message: "Error  User with id" + id + " not found",
//         errorType: error,
//       });
//     }
//     userFound.name = bodyUser.name;
//     userFound.email = bodyUser.email;
//     userFound.role = bodyUser.role;

//     userFound.save((error, userSaved) => {
//       if (error) {
//         return response.status(400).json({
//           ok: false,
//           message: "Error  updating user in Database",
//           errorType: error,
//         });
//       }
//       response.status(201).json({
//         ok: true,
//         message: "User updated",
//         usersCollection: userSaved,
//       });
//     });
//   });
// });
// // ===============================================================================
// // estableciendo la ruta para eliminar un usuario
// // ===============================================================================
// router.delete("/:idToDelete", middleware, (request, response, next) => {
//   var id = request.params.idToDelete;

//   User.findByIdAndRemove(id, (error, userDeleted) => {
//     if (error) {
//       return response.status(500).json({
//         ok: false,
//         message: "Error  deleting  user in Database",
//         errorType: error,
//       });
//     }

//     if (!userDeleted) {
//       return response.status(400).json({
//         ok: false,
//         message: "Error  not found user in database with that id",
//         errorType: { error: "Error  not found user in database with that id" },
//       });
//     }
//     response.status(200).json({
//       ok: true,
//       message: "User deleted",
//       usersCollection: userDeleted,
//     });
//   });
// });
// // ===================================================================================
// // Exportando la ruta o modulo para su uso en la aplicacion
// // ==================================================================================
module.exports = router;
