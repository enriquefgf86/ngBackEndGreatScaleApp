var express = require("express"); //inicializando express node
var app = express(); //asignado node a una variable llamada app
var Hospital = require("../models/hospitals"); //importando el modelo de hospitales del modelo esquematico
var middleware = require("../middleware/authentication.js").verifyToken;
var expressUpload = require("express-fileupload");

var fileSystem = require("fs"); //importando file sistem de nodes

var User = require("../models/user");
var Hospital = require("../models/hospitals");
var Doctor = require("../models/doctors");

app.use(expressUpload());

// ===========================================================================
// Estableciendo la ruta para obtener la data de esta ruta obteniendo
//todos los hospitales
// ===========================================================================
app.put("/:type/:userId", (request, response, next) => {
  var type = request.params.type;
  var id = request.params.userId;

  var validTypes = ["hospitals", "users", "doctors"];

  if (validTypes.indexOf(type) < 0) {
    response.status(400).json({
      ok: false,
      message: "No files in the request, wrong collection",
      errorType: "No files in the request, wrong collection",
    });
  }
  if (!request.files) {
    response.status(400).json({
      ok: false,
      message: "No files in the request",
      errorType: "No files in the request",
    });
  }
  //validacion para obtener nombre del archivo
  var archive = request.files.img;
  var reducedName = archive.name.split(".");
  var extensionArchive = reducedName[reducedName.length - 1];

  //setting only theavailable extensions
  var validExt = [
    "png",
    "jpeg",
    "jpg",
    "gif",
    "mov",
    "mp4",
    "webm",
    "avi",
    "mkv",
  ];

  if (validExt.indexOf(extensionArchive) < 0) {
    response.status(400).json({
      ok: false,
      message:
        "no authorized to upload this kind of file, the authorized are " +
        validExt.join(", "),
      errorType: "no authorized to upload this kind of file",
    });
  }
  //personalizar nombre de archivo
  var archiveName = `${id}-${new Date().getMilliseconds()}.${extensionArchive}`;

  //moviendo archivo del temporal a un path especifico

  var archivePath = `./uploadFiles/${type}/${archiveName}`;
  archive.mv(archivePath, (error) => {
    if (error) {
      return response.status(500).json({
        ok: false,
        message: "error moving file",
        errorType: "error moving file",
      });
    }

    uploadByType(type, id, archiveName, response);

    // response.status(200).json({
    //   ok: true,
    //   message: "moved archive",
    //   archive: extensionArchive,
    // });
  });
});

function uploadByType(type, id, archiveName, response) {
  if (type === "users") {
    User.findById(id, (error, user) => {
      if (!user) {
        return response.status(400).json({
          ok: false,
          message: "user not found",
          errorType: "user not found",
        });
      }
      var oldPath = "./uploadFiles/users/" + user.img;
      //condicion que determina si una imagen anterior existia en el
      //lugar a reemplazar por la nueva imagen ahora
      if (fileSystem.existsSync(oldPath)) {
        fileSystem.unlink(oldPath, (error) => {
          console.log(error);
        });
      }

      user.img = archiveName;
      user.save((error, userUpdated) => {
        userUpdated.password = ":)";
        if (error) {
          response.status(500).json({
            ok: false,
            message: "error moving file",
            errorType: "error moving file",
          });
        }
        return response.status(200).json({
          ok: true,
          message: "User Image updated",
          statusUser: userUpdated,
        });
      });
    });
  }

  if (type === "doctors") {
    Doctor.findById(id, (error, doctor) => {
      if (!doctor) {
        return response.status(400).json({
          ok: false,
          message: "doctor not found",
          errorType: "doctor not found",
        });
      }

      var oldPath = "./uploadFiles/doctors" + doctor.img;

      if (fileSystem.existsSync(oldPath)) {
        fileSystem.unlink(oldPath, (error) => {
          console.log(error);
        });
      }
      doctor.img = archiveName;

      doctor.save((error, doctorUpdated) => {
        if (error) {
          response.status(500).json({
            ok: false,
            message: "error moving file",
            errorType: "error moving file",
          });
        }
        return response.status(200).json({
          ok: true,
          message: "Doctor Image updated",
          statusDoctor: doctorUpdated,
        });
      });
    });
  }

  if (type === "hospitals") {
    Hospital.findById(id, (error, hospital) => {
      if (!hospital) {
        return response.status(400).json({
          ok: false,
          message: "hospital not found",
          errorType: "hospital not found",
        });
      }
      var oldPath = "./uploadFiles/hospitals" + hospital.img;

      if (fileSystem.existsSync(oldPath)) {
        fileSystem.unlink(oldPath, (error) => {
          console.log(error);
        });
      }

      hospital.img = archiveName;

      hospital.save((error, hospitalUpdated) => {
        if (error) {
          response.status(500).json({
            ok: false,
            message: "error moving file",
            errorType: "error moving file",
          });
        }
        return response.status(200).json({
          ok: true,
          message: "Doctor Image updated",
          statusHosital: hospitalUpdated,
        });
      });
    });
  }
}

module.exports = app;
