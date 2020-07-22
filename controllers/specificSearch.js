var Doctor = require("../models/doctors");
var User = require("../models/user");
var Hospital = require("../models/hospitals");
// const {getJsonWebToken}=require('../helpers/jasonWebToken')

const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const { getJsonWebToken } = require("../helpers/jasonWebToken");

const getASpecificCollection = async (request, response = response, next) => {
  const searchResult = await request.params.search; //asignando a la variable searchResult el resultado
  //traido como request al usuario, en este caso asignado al item search , segun se
  //especifica en la ruta del endpoint
  const searchCollection = await request.params.collection; //asignando a la variable searchResult el resultado
  //traido como request al usuario, en este caso asignado al item search , segun se
  //especifica en la ruta del endpoint

  const reGex = new RegExp(searchResult, "i"); //establecidneo un avariable llamada reGex, que inicializaria la fucnion de
  //mongoose llamada  Regular Expression (RegExp)la cual se encargaria de establecer sobre queries y busquedas
  //un mapeo sin distinguir entre Lettras capitales , espacios y demas ...para ello se incializan como paramtros dentro de
  //la fucnion la constante searchResult traida en el request.params,y se especifica que sobre ella la busqueda
  //debe ser insensible de ahi que se establezca como segundo parametro ('i')

  let data = [];

  switch (searchCollection) {
    case "doctors":
      data = await Doctor.find({ name: reGex }).populate("user","name img").populate("hospital","name");

      break;
    case "users":
      data = await User.find({ name: reGex });

      break;
    case "hospitals":
      data = await Hospital.find({ name: reGex }).populate("user","name img");

      break;

    default:
      return response.status(400).json({
        ok: false,
        msg: "Collection must be users, doctors or hospitals",
      });
  }
  response.status(201).json({
    ok: true,
    msg: "Data Retrieved Ok",
    result: data,
  });

 

  response.status(201).json({
    ok: true,
    msg: "getting all collections",
    users,
    doctors,
    hospitals,
  });
};

module.exports = {
  getASpecificCollection,
};
