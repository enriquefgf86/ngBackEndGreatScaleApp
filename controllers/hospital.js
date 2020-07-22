var Hospital = require("../models/hospitals");
var User = require("../models/user");
// const {getJsonWebToken}=require('../helpers/jasonWebToken')

const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const { getJsonWebToken } = require("../helpers/jasonWebToken");

const getAllHospitals = async (request, response = response, next) => {
  const allHospitals = await Hospital.find().populate("user","name img email");//en este caso vease que simplemente 
  //sea accede a la colleccion completa de hospitales ademas , ser un poco mas especifcio y mediante la 
  //fucnion de mongoose populate , se especifica que de dicha collecion traida de los hospitales es necesario 
  //que se extraiga para cada uno  del apartado de user(traido en cada hospital) su nombre, email e imagen

  response.status(201).json({
    ok: true,
    msg: "getallHospitals",
    allHospitals,
  });
};

//========================================================================================
//Creando el hospital
//=====================================================================================
const createAHospital = async (request, response, next) => {
  const userId =  request.userId; //vease que se extrae del token el user Id devengado en el jwt necesario para relaizar cualquier
  //accion de crearHospitales(a traves del usuario con token simepre)
  const hospital = new Hospital({ user: request.userId, ...request.body }); //en este proceso vease que se desestructura
  //todo lo referente al modelo de Hospital que se trae en el requeswt body, (...request.body), y una vez hecho
  //esto se procederia a asiganr a uno de sus parametros (user) el valor del id traido del jwt token pr el usuario
  //autentificado

  console.log(request.userId);
  console.log(userId);
  console.log(hospital);
  console.log(request);

  try {
    const hospitalDb = await hospital.save();
    await response.status(201).json({
      //se devuelve un esstado positivo sobre la creacion del hospital
      ok: true,
      msg: "Hospital created",
      hospital: hospitalDb,
      user:userId
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

const updateHospital = async (request, response = response) => {
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
      msg: "Hospital Updated",
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

const deleteHospital = async (request, response = response) => {
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
      msg: "Hospital has been deleted",
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
  getAllHospitals,
  createAHospital,
  updateHospital,
  deleteHospital,
};
