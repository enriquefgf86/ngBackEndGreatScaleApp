//Este aprtado seria el encargado de acotar todos los endpoints necesarios 
//para establecer busquedas generales o especificas por collecion en la 
//base ddatos de la aplicacion

// =======================================================================
// Al igual que en el root app es necesario importar express node para establecer
// la fucnionalidad del backend de node, pero especificamente en vez de importarolo
//todo se hace referencia a uno de sus librerias especificas ,en este caso la de ROuter
// =======================================================================
const { Router } = require("express"); //importando express asignandosleea una variable constante llamada Router
//vease que la variable se encierra en parentesis a manera de desagregacion
//en caso de que a futuro se pretendan insertar nuevas constantes en la misma
//linea

//================================================================================================
//importando del la crapeta de controllers , especificamente de la carpeta specificSearch,la variable 
//llamada getASpecificCollection inicializada por fucnion especifica , que realizaria todolo referente
//a busquedas especificas detnreo de las collecciones esquematicas en la bvase de datos
//==================================================================================================
const { getASpecificCollection } = require("../controllers/specificSearch"); //importando del controlador 
//de usuarios todo lo referente a la ruta o cada una de lloas rutas del controller para usario

//================================================================================================
//importando del la crapeta de controllers , especificamente de la carpeta generalSearch,la variable 
//llamada getAllCollections  inicializada por fucnion especifica , que realizaria todo lo referente
//a busquedas totales de todas las colleciones esquematicas en la base de datos
//==================================================================================================
const { getAllCollections } = require("../controllers/generalSearch");


//=======================================================================
//se inicializa en este apartado la constante router que le daria routerizacion a este modulo
//del paquete de express especificamente de la libreria Router()previamente requerida
//e inicializada como constante const { Router }
//========================================================================
const router = Router(); //inicializando la constante Router previamente requerida en este apartado
//de rutas a traves de express

//=========================================================================================
//se importa el middelware validateJwt de la carpetas de middleware jwtMiddleware , lo cual
//verificaria antes de acceder a culaquier endpoint y su respectiva fucnionalidad , si el token
//que presenta el usuario en cuestion para accionar es valido o no , este middleware seria el
//encargado de constatar y autorizar el siguiente paso en la operacion o no teniendo en
//cuenta la validez del token
//=======================================================================================
const { validateJwt } = require("../middleware/jwtMiddleware");

// ===========================================================================
// Se establece el endpoint que en este especifc caso traeria todas las colleciones 
//segun la logica del controler, vease que como parametro se especifica :search,
//o sea que en el request debera venir algo que trigerice dicha busqueda, y una vez venido
//sera necesario verificar la autorizacion del  usuario para dicho request mediante el middleware
//que verifica la validacion de os token, en donde de no existir ningun problema se pasaria
//entonces a la ejecucion del controller como tal getAllCollections
// ===========================================================================
router.get("/:search", validateJwt, getAllCollections); //Obtener todos los usuarios

// ===========================================================================
// Se establece el endpoint que en este especifc caso traeria todas una collecion especifica
//segun la logica del controler, vease que como parametro se especifica el tipo de coleccion
//:collection(doctors,hospitals, user), y acto seguido la busqueda o paramtro de busqueda en si 
//o sea que en el request debera venir algo que trigerice dicha busqueda, pero primero debera especificarse
//sobre que collecion, y una vez venido
//sera necesario verificar la autorizacion del  usuario para dicho request mediante el middleware
//que verifica la validacion de os token, en donde de no existir ningun problema se pasaria
//entonces a la ejecucion del controller como tal  getASpecificCollection
// ===========================================================================
router.get(
  "/specific/:collection/:search",
  validateJwt,
  getASpecificCollection
); //Obtener todos los usuarios

//=========================================================================================
//Exportando el router de este endpoint
//=========================================================================================
module.exports = router;//por ultimo se exporta porta la variable router que es al encargada de re
//sumir todos estos endpoints para su futuro uso en los demas modulos de la aplicacion , vease
//que dicha variable seria la inicializacion del proceso propio de express Router()
