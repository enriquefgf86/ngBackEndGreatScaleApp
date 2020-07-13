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
var cryptoPaswword = require("bcryptjs");
//=======================================================================
//inicializando variables express
//========================================================================
var app = express();

var User = require("../models/user");
var jsonWebToken = require("jsonwebtoken");
var SEED = require("../config/config").SEED;
var middleware = require("../middleware/authentication.js").verifyToken;

// ===========================================================================
// Estableciendo la ruta para obtener la data de esta ruta obteniendo
//todos los usuarios
// ===========================================================================
app.get("/", (request, response, next) => {
  var from = request.query.from || 0;
  from = Number(from); //paginando desde que numero se debe empezar a contar cuando se haga el request,
  //o sea trayendo los nuemros desde (from)el ultimo listado en el primer request
  //otro grupo (limit), y asi sucesivamente

  User.find({}, "name email role img")
    .skip(from)
    .limit(4)
    .exec((error, users) => {
      if (error) {
        return response.status(500).json({
          ok: false,
          message: "Error in Database",
          errorType: error,
        });
      }
      User.count({}, (error, counting) => {
        response.status(200).json({
          ok: true,
          message: "users",
          usersCollection: users,
          userTotalCount:counting,
        });
      });
      
    });
});

//==========================================================================
// Estableciendo la ruta para crear usuario
// ===========================================================================
app.post("/", middleware, (request, response, next) => {
  var body = request.body;

  var user = new User({
    name: body.name,
    email: body.email,
    password: cryptoPaswword.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  user.save((error, userSaved) => {
    if (error) {
      return response.status(400).json({
        ok: false,
        message: "Error  creating user in Database",
        errorType: error,
      });
    }
    userSaved.password = ":)";

    response.status(201).json({
      ok: true,
      message: "User created",
      usersCollection: userSaved,
      userToken: request.user,
    });
  });
});

// ===========================================================================
// Estableciendo la ruta para modificar o actualizar usuario
// ===========================================================================
app.put("/:id", middleware, (request, response, next) => {
  var id = request.params.id;

  var bodyUser = request.body;

  User.findById(id, (error, userFound) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error  in database",
        errorType: error,
      });
    }
    if (!userFound) {
      return response.status(404).json({
        ok: false,
        message: "Error  User with id" + id + " not found",
        errorType: error,
      });
    }
    userFound.name = bodyUser.name;
    userFound.email = bodyUser.email;
    userFound.role = bodyUser.role;

    userFound.save((error, userSaved) => {
      if (error) {
        return response.status(400).json({
          ok: false,
          message: "Error  updating user in Database",
          errorType: error,
        });
      }
      response.status(201).json({
        ok: true,
        message: "User updated",
        usersCollection: userSaved,
      });
    });
  });
});
// ===============================================================================
// estableciendo la ruta para eliminar un usuario
// ===============================================================================
app.delete("/:idToDelete", middleware, (request, response, next) => {
  var id = request.params.idToDelete;

  User.findByIdAndRemove(id, (error, userDeleted) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error  deleting  user in Database",
        errorType: error,
      });
    }

    if (!userDeleted) {
      return response.status(400).json({
        ok: false,
        message: "Error  not found user in database with that id",
        errorType: { error: "Error  not found user in database with that id" },
      });
    }
    response.status(200).json({
      ok: true,
      message: "User deleted",
      usersCollection: userDeleted,
    });
  });
});
// ===================================================================================
// Exportando la ruta o modulo para su uso en la aplicacion
// ==================================================================================
module.exports = app;
