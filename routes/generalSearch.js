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

const { getASpecificCollection } = require("../controllers/specificSearch"); //importando del controlador de usuarios todo lo referente a la ruta
//o cada una de lloas rutas del controller para usario

const { getAllCollections } = require("../controllers/generalSearch");

// const { createAHospital } = require("../controllers/hospitals"); //importando del controlador de usuarios todo lo referente a la ruta
// //o cada una de lloas rutas del controller para usario

// const { updateHospital } = require("../controllers/hospitals"); //importando del controlador de usuarios todo lo referente a la ruta
// //o cada una de lloas rutas del controller para usario en este caso la ruta de actualizar usuario

// const { deleteHospital } = require("../controllers/hospitals"); //importando del controlador de usuarios todo lo referente a la ruta
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

var Hospital = require("../models/hospitals");
// var jsonWebToken = require("jsonwebtoken");
const { validateJwt } = require("../middleware/jwtMiddleware");
// var SEED = require("../config/config").SEED;
// var middleware = require("../middleware/authentication.js").verifyToken;

// ===========================================================================
// Estableciendo la ruta para obtener la data de esta ruta obteniendo
//todos los usuarios
// ===========================================================================
router.get("/:search", validateJwt, getAllCollections); //Obtener todos los usuarios

router.get(
  "/specific/:collection/:search",
  validateJwt,
  getASpecificCollection
); //Obtener todos los usuarios

// ===========================================================================
// Estableciendo la ruta para crear un usuario
// ===========================================================================
module.exports = router;
