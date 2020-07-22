var Hospital = require("../models/hospitals");
var User = require("../models/user");
// const {getJsonWebToken}=require('../helpers/jasonWebToken')

const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const { getJsonWebToken } = require("../helpers/jasonWebToken");

const getAllHospitals = async (request, response = response, next) => {
  const allHospitals = await Hospital.find().populate("user", "name img email"); //en este caso vease que simplemente
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
  const userId = request.userId; //vease que se extrae del token el user Id devengado en el jwt necesario para relaizar cualquier
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
      user: userId,
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
  const hospitalId = request.params.id; //designando el id traido por el hospital en el request de sus parametros d
  //previamente denotado en el archivo de routas para el hospital(/:id)el URL
  const userId = request.userId;
  const hospitalDb = Hospital.findById(hospitalId); //buscando la exiyencia del hospital traido en el
  //parametro
  try {
    if (!hospitalDb) {
      return response.status(401).json({
        //se devuelve un esstado negativo sobre la modificacion del hospital
        ok: false,
        msg: "Hospital Doesnt exist",
      });
    }
    const hospitalModifcation = { ...request.body, user: userId }; //basicamente  se crea una constante
    //la cual desagrega todo el body traido en el request perteneciente al endpoint de modificar hospital
    //y con ella tambien se le asigna a uno de los items de ese body desagregado (user), el id del
    //usuario que acomete la modificacion , previamente traido en el requet despues de haber pasado
    //la validacion del token

    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      hospitalModifcation,
      { new: true }
    );
    //Esta manera manera de modificacion es un poco mas sencilla y abarcadora pues pposterior al paso
    //anterior en donde se desagrega  el body request , y se le asigana uno de sus items(user) el
    //id traido y validado por el token (userId), simplemente ya se acederia entocens al constructor de
    //hospital para modifcar y a traves de la funcion findByIdAndUpdate, como bien se dice
    //primero se pasaria el id del hospital en cuestion traido median el request params(hospitalId), luego
    //se pasarian los paremtros del update, los cuales se realizaron en el paso anterior , y por ultimo
    //entonces se inicializaria el template new:true lo cual regresaria el ultimo documento actulaizaod

    await response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      msg: "Hospital Updated",
      hospital: updatedHospital,
      //   userDbFieldsUpdated,
    }); //trayendo entonces la respuesta positiva ya con el hospital actualizado
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
  const userId = request.params.userId;
  const hospitalId = request.params.id; //designando el id traido por el hospital en el request de sus parametros d

  try {
    const hospital = await Hospital.findById(hospitalId); //se busca dentro del cpntructor de Hospital
    //la existenxia o no de un item con el id traido en el parametro

    if (!hospital) {
      return response.status(401).json({
        ok: false,
        msg: "Hospital has been deleted",
      }); //se devuelve un esstado negativo sobre la modificacion del usuario del usuario
    }

    await Hospital.findByIdAndDelete(hospitalId);//ordenando la accion de eliminar
    //el hospitalsegun el id traido en el request params y filtrado por las difrentes callbacks
    //lo cual nos indica que si llego hasta aqui es porque existe , de ahi entonces que se pueda 
    //proceder a acceder al constructor de hospital y mediante el al metodo findByIdAndDelete
    //pasandole como paramtro dicho hospitalId

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
