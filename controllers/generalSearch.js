//En este apartado como bien se explica se procede a desarrollar los controller para todos los procesos de
//busqueda sobre todas la colleciones existentes en la base de datos , de ahi que se trabje con los tres esquemas
//de colecciones

//=========================================================================================================
//Importando los tres esquemas de collecciones que se usan en la aplicacion para la inicializacion de este
//apoartado de busqueda general
//====================================================================================================
var Doctor = require("../models/doctors"); //importando modelo de doctors , asigandolo a la variable Doctor
var User = require("../models/user"); //importando modelo de user , asigandolo a la variable User
var Hospital = require("../models/hospitals"); //importando modelo de hospitals , asigandolo a la variable Hospital

//===========================================================================================
//Como recurso extra se importa de express uno de sus items propios , el item respnse , que no seria
//mas que un helper para la escritura de syntax de codigos amedida que vayamos desarrolladndo
//los algoritmos
//=================================================================================================
const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

////////////////////////////////////////////////////////////////////////////////////////
//////////////            INICIO DE LOS CONTROLADORES            ////////////////////////////

//======================================================================================================
//Obteniendo el cluster de busqueda sobre todas las colleciones
//===================================================================================================
const getAllCollections = async (request, response = response, next) => {
  //Vease que se trigeriza dicho callback con 3 paramtros , request,
  //lo cual seria el acarraeador de variables informacion y demas traida
  //l bodyt , o el header , o como params para el desarrollo de la aplicacion,
  //luego se establece el response , que npo seria mas que el parametro que acarrea en si las
  //diferentes respouestas que pudiesen suscitarse como resultado de una accion o desenlace
  //del metodo, y pdiesen traer respuestas validas o errores, segun la logica del proceso;
  //vease que este response se iguala o se le asigna el respnse traido de express
  //a manera de facilitrar la escritura del syntax; por ultimo , aunque mas usado
  //en los middelware vendria el parametro de next, lo cual daria continuidad a cualesquiera otro
  //proceso una vez terminado el proceso actual de manera satisfactoria

  const searchResult = await request.params.search; //asignando a la variable searchResult el resultado
  //traido como request por el  usuario, en este caso asignado al item search , segun se
  //especifica en la ruta del endpoint (/:search),esto vedria siendo como la palabra por la cual se
  //buscaria en todas la colleciones

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
    //users, doctors y hospitals, y para cada una de ellas segun su tipo se le asigna el item sobre el cual referenciar
    //la busqueda (name), y el resultado d ela misma previamnete asignado a la variable reex
  ]);
  //vease que en este caso se realiza un a especie de multiporomesas que se ejecutan de manera simultanaia (Promise.all)
  //dentro de ellas entonces se inicializa un array de fuciones que devengarian un resultado , y entonces , y unicamente entonces
  //se pasaria a la sigueiente cuestion.Vease entonces que se incializa en la posicion 1 del array , el proceso que
  // traeria todos los User en segun el query de busqueda .Como segundo elemento dentro de dicho array de funciones
  //se seguiria el mismo proceso pero para Doctor, y por ultimo para Hospital .Estas fucniones son asignadas a sus
  //respectivas variables desagregadas en el  mismo orden que las fucniones ocuppan dentro
  //del array const [users, doctors, hospitals]

  response.status(201).json({
    ok: true,
    msg: "getting all collections",
    users,
    doctors,
    hospitals,
  });
}; //trayendo entonces la respuesta positiva ya con todo el grupp de promesas triggerizados y con los
//resultados alojados en la data por lo que simplemente dentro del cuerpo de la respuesta , ya vienen
//las variables previamente inicializadas con su respectivos valores asigandos por las sus correspondientes
//fucnciones triggerizadas dentro del array

module.exports = {
  getAllCollections,
}; //Exportandose el controlador ( getAllCollections), para su posetrior uso en las demas dependencias
