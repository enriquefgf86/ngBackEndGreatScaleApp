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
var express = require("express");
//=======================================================================
//inicializando variables express
//========================================================================
var app = express();

var User = require("../models/user");
var Hospital = require("../models/hospitals");
var Doctor = require("../models/doctors");
var middleware = require("../middleware/authentication.js").verifyToken;
//============================================================================
//Estableciendo la ruata para buscar por colleccion en la base de datos
//============================================================================
app.get("/collection/:collectionTable/:search", (request, response, next) => {
  var searchForCollection = request.params.collectionTable;
  var searchFor = request.params.search;
  var regularExpression = new RegExp(searchFor, "i");

  var promise;
  var collectionName;

  switch (searchForCollection) {
    case "users": //searchForCollection solo se implementaria con una de estas tres palabras(users/doctors/hospitals)
      promise = findUsers(searchFor, regularExpression);
      break;

    case "doctors": //searchForCollection solo se implementaria con una de estas tres palabras(users/doctors/hospitals)
      promise = findDoctors(searchFor, regularExpression);
      break;

    case "hospitals": //searchForCollection solo se implementaria con una de estas tres palabras(users/doctors/hospitals)
      promise = findHospitals(searchFor, regularExpression);
      break;
    default:
      return response.status(400).json({
        ok: false,
        message: "Error  in the query for collection",
        errorType: error,
      });
  }

  promise.then((data) => {
    response.status(201).json({
      ok: true,
      message: "Collection fetched",
      collections: data,
    });
  });
});

// ===========================================================================
// Estableciendo la ruta para obtener la data de esta ruta obteniendo
//todos los datos o collecciones segun las especificaciones del url
// ===========================================================================
app.get("/all/:search", (request, response, next) => {
  var searchFor = request.params.search;
  var regularExpression = new RegExp(searchFor, "i"); //convirtiendo a expression irregular elparamtro obtenido
  //del request
  Promise.all([
    findHospitals(searchFor, regularExpression),
    findDoctors(searchFor, regularExpression),
    findUsers(searchFor, regularExpression),
  ]).then((responses) => {
    response.status(200).json({
      ok: true,
      message: "General Search",
      allSearchedHospitals: responses[0],
      allSearchedDoctros: responses[1],
      allSearchedUsers: responses[2],
    });
  });
});
function findHospitals(searchFor, regularExpression) {
  return new Promise((resolve, reject) => {
    Hospital.find({ name: regularExpression })
      .populate("user", "name email")
      .exec((error, hospitals) => {
        if (error) {
          return reject("Error in query", error);
        } else {
          return resolve(hospitals);
        }
      });
  });
}
function findDoctors(searchFor, regularExpression) {
  return new Promise((resolve, reject) => {
    Doctor.find({ name: regularExpression })
      .populate("user", "email name")
      .exec((error, doctors) => {
        if (error) {
          return reject("Error in query de busqueda de medico", error);
        } else {
          return resolve(doctors);
        }
      });
  });
}
function findUsers(searchFor, regularExpression) {
  return new Promise((resolve, reject) => {
    User.find({}, "name email role")
      .or([{ name: regularExpression }, { email: regularExpression }]) //bucando usarios por nombre e email
      .exec((error, users) => {
        if (error) {
          return reject("Error in query de busqueda de usuario", error);
        } else {
          return resolve(users);
        }
      });
  });
}

// //==========================================================================
// // Estableciendo la ruta para crear usuario
// // ===========================================================================
// app.post("/", middleware, (request, response, next) => {
//   var body = request.body;

//   var user = new User({
//     name: body.name,
//     email: body.email,
//     password: cryptoPaswword.hashSync(body.password, 10),
//     img: body.img,
//     role: body.role,
//   });

//   user.save((error, userSaved) => {
//     if (error) {
//       return response.status(400).json({
//         ok: false,
//         message: "Error  creating user in Database",
//         errorType: error,
//       });
//     }
//     userSaved.password = ":)";

//     response.status(201).json({
//       ok: true,
//       message: "User created",
//       usersCollection: userSaved,
//       userToken: request.user,
//     });
//   });
// });

// // ===========================================================================
// // Estableciendo la ruta para modificar o actualizar usuario
// // ===========================================================================
// app.put("/:id", middleware, (request, response, next) => {
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
// app.delete("/:idToDelete", middleware, (request, response, next) => {
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
module.exports = app;
