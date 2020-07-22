var Doctor = require("../models/doctors");
var User = require("../models/user");
var Hospital = require("../models/hospitals");
// const {getJsonWebToken}=require('../helpers/jasonWebToken')

const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const { getJsonWebToken } = require("../helpers/jasonWebToken");

const getAllCollections = async (request, response = response, next) => {
  const searchResult = await request.params.search; //asignando a la variable searchResult el resultado
  //traido como request al usuario, en este caso asignado al item search , segun se
  //especifica en la ruta del endpoint

  const reGex = new RegExp(searchResult, "i"); //establecidneo un avariable llamada reGex, que inicializaria la fucnion de
  //mongoose llamada  Regular Expression (RegExp)la cual se encargaria de establecer sobre queries y busquedas
  //un mapeo sin distinguir entre Lettras capitales , espacios y demas ...para ello se incializan como paramtros dentro de
  //la fucnion la constante searchResult traida en el request.params,y se especifica que sobre ella la busqueda
  //debe ser insensible de ahi que se establezca como segundo parametro ('i')

  const [users, doctors, hospitals] = await Promise.all([
    User.find({ name: reGex }),
    Doctor.find({ name: reGex }),
    Hospital.find({ name: reGex }),
    //vease entonces que en este apartado se inicializan 3 constantes
    //users, doctors y hopspitasl, y para cda una de ellas segun su tipo se le asigna el item sobre el cual referenciar
    //la busqueda (name), y el resultado d ela misma previamnete asignado a la variable reex
  ]);
  //vease que en este caso se realiza un a especie de multiporomesas que se ejecutan de manera simultanaia (Promise.all)
  //dentro de ellas entonces se inicializa un array de fuciones que devengarian un resultado , y entonces , y unicamente entonces
  //se pasaria a la sigueiente cuestion.Vease entonces que se incializa en la posicion 1 del array , el proceso que
  // traeria todos los User en segun el query de busqueda .Como segundo elemento dentro de dicho array de funciones
  //se seguiria el mismo proceso pero para Doctor, y por ultimo para Hospital .Estas fucniones son asignadas a sus
  //respectivas variablesdesagregadas en el  mismo orden que las fucniones ocuppan dentro
  //del array const [users, doctors, hospitals]

  response.status(201).json({
    ok: true,
    msg: "getting all collections",
    users,
    doctors,
    hospitals,
  });
};

module.exports = {
  getAllCollections,
};
