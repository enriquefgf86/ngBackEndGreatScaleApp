//En este apartado como bien se explica se procede a desarrollar los controller para para la busqueda en especifico
//de una de las colleciones que tine la base de datos , y de ella una vez encontrada buscarbajo el criterio del usuario
//para ello entonces se hace necesario imprtar todos los esquemas asi como librerias de esxpress y externas

//=========================================================================================================
//Importando los tres esquemas de collecciones que se usan en la aplicacion para la inicializacion de este
//apoartado de busqueda general
//====================================================================================================
var Doctor = require("../models/doctors");
var User = require("../models/user");
var Hospital = require("../models/hospitals");

//===========================================================================================
//Como recurso extra se importa de express uno de sus items propios , el item respnse , que no seria
//mas que un helper para la escritura de syntax de codigos amedida que vayamos desarrolladndo
//los algoritmos
//=================================================================================================
const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

const getASpecificCollection = async (request, response = response, next) => {
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
  //traido como request al usuario, en este caso asignado al item search , segun se
  //especifica en la ruta del endpoint/:search

  const searchCollection = await request.params.collection; //asignando a la variable searchResult el resultado
  //traido como request al usuario, en este caso asignado al item search , segun se
  //especifica en la ruta del endpoint :/collection

  const reGex = new RegExp(searchResult, "i"); //establecidneo un avariable llamada reGex, que inicializaria la fucnion de
  //mongoose llamada  Regular Expression (RegExp)la cual se encargaria de establecer sobre queries y busquedas
  //un mapeo sin distinguir entre Lettras capitales , espacios y demas ...para ello se incializan como paramtros dentro de
  //la fucnion la constante searchResult traida en el request.params,y se especifica que sobre ella la busqueda
  //debe ser insensible de ahi que se establezca como segundo parametro ('i')

  let data = []; //creando un avariable la cual albergaria cualesquiera informacion arrojada en ella por el swithc
  //a continuacion

  //A continuacion se incializa un prcoeso de swithc el cual teniendo como criterio de accion la variable
  //searchCollection conteneddora del parametro que especifica la colleccion por la cual el usuario quiere
  //buscar previamente traida mediante request.params.collection, se procederia a dessarolla r procesos para
  //cada una de dichas collecciones , asigandosele el resultado de dicho proceso a la variable data(array inicializado
  //anteriormente)
  switch (searchCollection) {
    case "doctors": //para doctors (debe ser como se escribe en el url este case)
      data = await Doctor.find({ name: reGex })
        .populate("user", "name img")
        .populate("hospital", "name");
      //se acciona sobre el esquema de Doctros, accediendose al metodo find,y de la collecion entonces se traeria
      //los items que cumplen con los parametros del search escritos por el usuario y asigandos a la variable reGex
      //a la cual le fue asigando el search traido medianterequest.parms .search por el usuario , aunque no teniendo
      //en consideracion letras capitales y demas , esto mediante su desestructurracion con el plugin propio de expresss
      //RegExp(Regular expression) .Vease que se especifica que un vez hecho el query y obteneida el objeto o los
      //objetos que cumplen con esa busque se procederia a popularlos o popular el Api, primero con el apartado de
      //user, especificandose de el nombre e imagen , y con el aprtado de hospital , especificandose de el su nombre
      //

      break; //luego la funcion rompe ciclo para esta colleccion con un  break

    case "users": //para users (debe ser como se escribe en el url este case)
      data = await User.find({ name: reGex });
      //se acciona sobre el esquema de Hospital, accediendose al metodo find,y de la collecion entonces se traeria
      //los items que cumplen con los parametros del search escritos por el usuario y asignas a la variable reGex
      //a la cual le fue asigando el search traido mediante request.parms .search por el usuario , aunque no teniendo
      //en consideracion letras capitales y demas , esto mediante su desestructurracion con el plugin propio de expresss
      //RegExp(Regular expression)

      break; //luego la funcion rompe ciclo para esta colleccion con un  break

    case "hospitals": //para hospitals (debe ser como se escribe en el url este case)
      data = await Hospital.find({ name: reGex }).populate("user", "name img");
      //se acciona sobre el esquema de Hospital, accediendose al metodo find,y de la collecion entonces se traeria
      //los items que cumplen con los parametros del search escritos por el usuario y asigandos a la variable reGex
      //a la cual le fue asigando el search traido medianterequest.parms .search por el usuario , aunque no teniendo
      //en consideracion letras capitales y demas , esto mediante su desestructurracion con el plugin propio de expresss
      //RegExp(Regular expression) .Vease que se especifica que un vez hecho el query y obteneida el objeto o los
      //objetos que cumplen con esa busque se procederia a popularlos o popular el Api, primero con el apartado de
      //user, especificandose de el nombre e imagen ,

      break; //luego la funcion rompe ciclo para esta colleccion con un  break

    default:
      //de no entrar en ninguno de los case anteriores se entraria en uno por default
      return response.status(400).json({
        ok: false,
        msg: "Collection must be users, doctors or hospitals",
      });
    //en este caso de entrar en el case por default se procederia a arrojar una respuesta negativa pues
    //ninguno d elos criterios para los cuales se desarrollo la funcion fueron cumplidos
  }
  response.status(201).json({
    ok: true,
    msg: "Data Retrieved Ok",
    result: data,
  }); //Pasado el proceso se procede entonces a dar una respuesta positiva como resultado del cicclo exitoso
  //del proceso

  // response.status(201).json({
  //   ok: true,
  //   msg: "getting all collections",
  //   users,
  //   doctors,
  //   hospitals,
  // });
};

module.exports = {
  getASpecificCollection,
}; //Exportandose el controlador ( getAllCollections), para su posetrior uso en las demas dependencias
