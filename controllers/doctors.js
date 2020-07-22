var Doctor = require("../models/doctors");
// const {getJsonWebToken}=require('../helpers/jasonWebToken')

const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const { getJsonWebToken } = require("../helpers/jasonWebToken");

const getAllDoctors = async (request, response = response, next) => {
  const allDoctors = await Doctor.find({}, "name  img")
    .populate("hospital", "name")
    .populate("user", "name img email");

  response.status(201).json({
    ok: true,
    msg: "getting all doctors",
    allDoctors,
  });
};

//========================================================================================
//Creando el usuario  controller
//=====================================================================================
const createADoctor = async (request, response, next) => {
  const userId = request.userId;
  const doctor = new Doctor({ user: userId, ...request.body });

  try {
    const doctorDb = await doctor.save();
    await response.status(201).json({
      //se devuelve un esstado positivo sobre la creacion del docotor
      ok: true,
      msg: "Doctor created",
      doctor: doctorDb,
    });
  } catch (error) {
    //de lo contrario entonces en este catch se devolveria unu error
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  }
};
//========================================================================================
//Modificar el usuario
//=====================================================================================

const updateDoctor = async (request, response = response) => {
  const doctorId = request.params.idDoctor; //trayendo enntoces el id del doctor a modificar en cuestion
  //pasod mediante el requet param de la ruta del servicio que sugiere dicha actualizacion(/:idDoctor)

  const userId = request.userId; //designando el id traido por el usuario en el request
  //de sus parametros oel URL proveido por el token

  try {
    const doctorDb = await Doctor.findById(doctorId); //estableciendo la constante que de cierta
    //manera le seria asignada el id necesario para determinar con posterioridad si el id
    //existente existe para ese doctor o no

    if (!doctorDb) {
      return response.status(400).json({
        ok: false,
        msg: "doctor  doesn't exist",
      });
    }

    const doctorModified = await { ...request.body, user: userId }; //desagregando el body y todos los elementos
    //que en el se traigan para modificar al doctor , para entonces una vez hecho esto proceder a la
    //actualizacion del mismo , vease que uno de los paramtros desagregados seria el user, y se le
    //asiganria al mismo el user correspondiente al id traido en el token despues de validar(userId)

    console.log(request.body);
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      doctorModified,
      { new: true }
    );
    //Esta manera manera de modificacion es un poco mas sencilla y abarcadora pues pposterior al paso
    //anterior en donde se desagrega  el body request , y se le asigana uno de sus items(user) el
    //id traido y validado por el token (userId), simplemente ya se acederia entocens al constructor de
    //doctor para modifcar y a traves de la funcion findByIdAndUpdate, como bien se dice
    //primero se pasaria el id del hospital en cuestion traido median el request params(doctorId), luego
    //se pasarian los paremtros del update, los cuales se realizaron en el paso anterior , y por ultimo
    //entonces se inicializaria el template new:true lo cual regresaria el ultimo documento actulaizaod

    await response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      msg: "Doctor Updated",
      doctor: updatedDoctor,
    }); //trayendo entonces la respuesta positiva ya con el doctor actualizado
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  }
};

//========================================================================================
//borrar  el doctor
//=====================================================================================

const deleteDoctor = async (request, response = response) => {
  const userId = request.userId; //trayendo a traves del token el id del usuario que acomete
  //la eliminancion del doctor

  const doctorId = request.params.idDoctor; //establecciendo en uan constante el id traiudo
  //mediante url del doctor en cuestion a borrar

  try {
    const doctorDb = await Doctor.findById(doctorId); //estableciendo la constante que almacenaria
    //el objeto del doctor que se encontro segun su id dentor del back-end serve

    if (!doctorDb) {
      return await response.status(404).json({
        ok: false,
        msg: "doctor doesn't exist",
      }); // validacion para saber si el id del doctor solicitado existe
    }
    await Doctor.findByIdAndDelete(doctorId);

    response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      msg: "Doctor has been deleted",
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  }
};

module.exports = {
  getAllDoctors,
  createADoctor,
  updateDoctor,
  deleteDoctor,
};
