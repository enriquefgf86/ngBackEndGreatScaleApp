var Doctor = require("../models/doctors");
// const {getJsonWebToken}=require('../helpers/jasonWebToken')

const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const { getJsonWebToken } = require("../helpers/jasonWebToken");

const getAllDoctors = async (request, response = response, next) => {
    const allDoctors = await Doctor.find({}, "name  img").populate("hospital","name").populate("user","name img email");

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
    const doctorDb =await  doctor.save();
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
  //   const userId = request.params.id; //designando el id traido por el usuario en el request de sus parametros oel URL

  try {
    //proceso de logica

    // const userDb = await User.findById(userId); //asiganado a la variable userDb el oid traido por el usuario en el params

    // if (!userDb) {
    //   //validacion para saber si el id del usuario solicitado existe
    //   return response.status(400).json({
    //     ok: false,
    //     msg: "user doesn't exist",
    //   });
    // }

    // const { password, google, email, ...userDbFields } = request.body; //trayendo todo lo que el usuario y sus items representa en el body del request

    // if (userDb.email !== email) {
    //   //para evitar la modificacion de un correo a un correo ya existente o no actualizado
    //   //lo cual duplicaria los keys de ahi su elimnacion del cuerpo modificado asigando a

    //   const emailExisting = await User.findOne({ email }); //inicializando variable que trae el email existente en
    //   //el esque,a del usuario, para posteriores validaciones

    //   if (emailExisting) {
    //     return response.status(400).json({
    //       ok: false,
    //       msg: "cant Update to this email cause already exists",
    //     });
    //   }
    // }

    // userDbFields.email = await email;

    // // delete userDbFields.password;//borrando de los campos de actualizacion asignados a la variable userDbFields los
    // // delete userDbFields.google;//iems password y google , pues los mismos no se necesitan actualizar en este ejercicio

    // const userDbFieldsUpdated = await User.findByIdAndUpdate(
    //   userId,
    //   userDbFields,
    //   { new: true }
    // );

    await response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      msg: "Doctor Updated",
      //   userDbFieldsUpdated,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  }
};

//========================================================================================
//borrar  el usuario
//=====================================================================================

const deleteDoctor = async (request, response = response) => {
  //   const userId = request.params.id;

  try {
    // const userDb = await User.findById(userId);

    // if (!userDb) {
    //   // validacion para saber si el id del usuario solicitado existe
    //   return await response.status(404).json({
    //     ok: false,
    //     msg: "user doesn't exist",
    //   });
    // }
    // await User.findByIdAndDelete(userId);

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
