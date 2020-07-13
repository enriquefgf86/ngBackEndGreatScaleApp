var express = require("express"); //inicializando express node
var app = express(); //asignado node a una variable llamada app
var Doctor = require("../models/doctors"); //importando el modelo de doctores del modelo esquematico
var middleware = require("../middleware/authentication.js").verifyToken;

// ===========================================================================
// Estableciendo la ruta para obtener la data de esta ruta obteniendo
//todos los doctores
// ===========================================================================
app.get("/", (request, response, next) => {
  var from = request.query.from || 0;
  from = Number(from); //paginando desde que numero se debe empezar a contar cuando se haga el request,
  //o sea trayendo los nuemros desde (from)el ultimo listado en el primer request
  //otro grupo (limit), y asi sucesivamente

  Doctor.find({})
    .skip(from)
    .limit(4)
    .populate("user", "name email")
    .populate("hospital")
    .exec((error, doctors) => {
      if (error) {
        return response.status(500).json({
          ok: false,
          message: "Error in Database getting all doctors",
          errorType: error,
        });
      }
      Doctor.count({}, (error, counting) => {
        response.status(200).json({
          ok: true,
          message: "All doctors",
          doctorsCollection: doctors,
          countDoctors:counting,
        });
      });
    });
});

// ===========================================================================
// Estableciendo la ruta para desarrollar la logica de crear un doctor
// ===========================================================================
app.post("/", middleware, (request, response, next) => {
  let bodyDoctor = request.body;

  let doctorCreated = new Doctor({
    name: bodyDoctor.name,
    user: request.user._id,
    hospital: bodyDoctor.hospital,
  });

  doctorCreated.save((error, doctorSaved) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error in Database creating the  doctor",
        errorType: error,
      });
    }
    response.status(201).json({
      ok: true,
      message: "doctor created ",
      doctorsCollection: doctorSaved,
      // userToken:request.user
    });
  });
});

// ===========================================================================
// Estableciendo la ruta para desarrollar la logica de modificar un doctor
// ===========================================================================

app.put("/:doctorId", middleware, (request, response, next) => {
  let id = request.params.doctorId;
  let doctorBody = request.body;

  Doctor.findById(id, (error, doctorFound) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error  in database",
        errorType: error,
      });
    }
    //determinando el error en especifico en caso de que el la base de datos
    //diese u error desconocido
    if (!doctorFound) {
      return response.status(404).json({
        ok: false,
        message: "Error  doctor with id" + id + " not found",
        errorType: error,
      });
    }
    //determinando el error en especifico en caso de que el id insertado no existiese en la
    //base de datos
    doctorFound.name = doctorBody.name;
    doctorFound.user = request.user._id;
    doctorFound.hospital = doctorBody.hospital;
    //proceso de modificacion del doctor para los parametros que se quieran

    doctorFound.save((error, doctorSaved) => {
      //iniciando el proceso de salvado del objeto modificado mediante funcion callback
      //para tambien de psao ientificar los posibles resultados , o sea , un parametro de
      //tipo error , que en donde de ser asi arrojaria una respuesta , y
      //otro parametro de tipo doctorSaved , el cual arrojaria una respuesta de tipo Ok
      //en caso de que el erro no existiese
      if (error) {
        return response.status(500).json({
          ok: false,
          message: "Error updating doctor  in database",
          errorType: error,
        });
      } //inicializandose uno de los parametros llamdos en el callback para el guardado de la funcion
      //en este caso constatandose si existe el error, de ser asi se retornaria un error de status 500
      //y pararia el ciclo de guardado isofacto
      response.status(201).json({
        ok: true,
        message: "doctor updated",
        doctorsCollection: doctorSaved,
      });
      //inicializandose uno de los parametros llamdos en el callback para el guardado de la funcion
      //en este caso constatandose que no existe el error, de ser asi se retornaria un de status 200
      //y terminaria en bue temrino la funcion
    });
  });
});

// ===========================================================================
// Estableciendo la ruta para desarrollar la logica de borrar un doctor
// ===========================================================================
app.delete("/:doctorId", middleware, (request, response, next) => {
  let id = request.params.doctorId;

  Doctor.findByIdAndRemove(id, (error, doctorDeleted) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "Error  deleting  doctor in Database",
        errorType: error,
      });
    }

    if (!doctorDeleted) {
      return response.status(400).json({
        ok: false,
        message: "Error  not found doctor in database with that id",
        errorType: { error: "Error  not found user in database with that id" },
      });
    }
    response.status(200).json({
      ok: true,
      message: "doctor deleted",
      doctorsCollection: doctorDeleted,
    });
  });
});

module.exports = app;
