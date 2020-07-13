var express = require("express"); //inicializando express node
var app = express(); //asignado node a una variable llamada app
var Hospital = require("../models/hospitals"); //importando el modelo de hospitales del modelo esquematico
var middleware = require("../middleware/authentication.js").verifyToken;

// ===========================================================================
// Estableciendo la ruta para obtener la data de esta ruta obteniendo
//todos los hospitales
// ===========================================================================
app.get("/", (request, response, next) => {
  var from = request.query.from || 0;
  from = Number(from); //paginando desde que numero se debe empezar a contar cuando se haga el request,
  //o sea trayendo los nuemros desde (from)el ultimo listado en el primer request
  //otro grupo (limit), y asi sucesivamente

  Hospital.find({})
    .skip(from)
    .limit(4)
    .populate("user", "name email")
    .exec((error, hospitals) => {
      if (error) {
        return response.status(500).json({
          ok: false,
          message: "Error in Database getting all hospitals",
          errorType: error,
        });
      }
      Hospital.count({}, (error, counting) => {
        response.status(200).json({
          ok: true,
          message: "All hospitals",
          hospitalssCollection: hospitals,
          hospitalCount: counting,
        });
      });
    });
});

// ===========================================================================
// Estableciendo la ruta para desarrollar la logica de crear un hospital
// ===========================================================================
app.post("/", middleware, (request, response, next) => {
  let bodyHospital = request.body;

  let hospitalCreated = new Hospital({
    name: bodyHospital.name,
    user: request.user._id,
  });

  hospitalCreated.save((error, hospitalSaved) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error in Database creating the  hospital",
        errorType: error,
      });
    }
    response.status(201).json({
      ok: true,
      message: "hospital created created",
      hospitalsCollection: hospitalSaved,
      // userToken:request.user
    });
  });
});

// ===========================================================================
// Estableciendo la ruta para desarrollar la logica de modificar un hospital
// ===========================================================================

app.put("/:hospitalId", middleware, (request, response, next) => {
  let id = request.params.hospitalId;
  let hospitalBody = request.body;

  Hospital.findById(id, (error, hospitalFound) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error  in database",
        errorType: error,
      });
    }
    //determinando el error en especifico en caso de que el la base de datos
    //diese u error desconocido
    if (!hospitalFound) {
      return response.status(404).json({
        ok: false,
        message: "Error  Hospital with id" + id + " not found",
        errorType: error,
      });
    }
    //determinando el error en especifico en caso de que el id insertado no existiese en la
    //base de datos
    hospitalFound.name = hospitalBody.name;
    hospitalFound.img = hospitalBody.img;
    hospitalFound.user = request.user._id;
    //proceso de modificacion del hospital para los parametros que se quieran

    hospitalFound.save((error, hospitalSaved) => {
      //iniciando el proceso de salvado del objeto modificado mediante funcion callback
      //para tambien de psao ientificar los posibles resultados , o sea , un parametro de
      //tipo error , que en donde de ser asi arrojaria una respuesta , y
      //otro parametro de tipo hospitalSaved , el cual arrojaria una respuesta de tipo Ok
      //en caso de que el erro no existiese
      if (error) {
        return response.status(500).json({
          ok: false,
          message: "Error updating hospital  in database",
          errorType: error,
        });
      } //inicializandose uno de los parametros llamdos en el callback para el guardado de la funcion
      //en este caso constatandose si existe el error, de ser asi se retornaria un error de status 500
      //y pararia el ciclo de guardado isofacto
      response.status(201).json({
        ok: true,
        message: "Hospital updated",
        hospitalsCollection: hospitalSaved,
      });
      //inicializandose uno de los parametros llamdos en el callback para el guardado de la funcion
      //en este caso constatandose que no existe el error, de ser asi se retornaria un de status 200
      //y terminaria en bue temrino la funcion
    });
  });
});

// ===========================================================================
// Estableciendo la ruta para desarrollar la logica de borrar un hospital
// ===========================================================================
app.delete("/:hospitalId", middleware, (request, response, next) => {
  let id = request.params.hospitalId;

  Hospital.findByIdAndRemove(id, (error, hospitalDeleted) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error  deleting  hospital in Database",
        errorType: error,
      });
    }

    if (!hospitalDeleted) {
      return response.status(400).json({
        ok: false,
        message: "Error  not found hospital in database with that id",
        errorType: { error: "Error  not found user in database with that id" },
      });
    }
    response.status(200).json({
      ok: true,
      message: "Hospital deleted",
      usersCollection: hospitalDeleted,
    });
  });
});

module.exports = app;
