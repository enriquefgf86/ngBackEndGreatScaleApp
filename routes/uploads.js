//En este aprtado se hace referencia a todo lo relacionado con carga y descarga de imagenes
//accediendose a dichos procesos mediante los respectivos endpoints

// =======================================================================
// Al igual que en el root app es necesario importar express node para establecer
// la fucnionalidad del backend de node, pero especificamente en vez de importarolo
//todo se hace referencia a uno de sus librerias especificas ,en este caso la de ROuter
// =======================================================================
const { Router } = require("express"); //importando express asignandosleea una variable constante llamada Router
//vease que la variable se encierra en parentesis a manera de desagregacion
//en caso de que a futuro se pretendan insertar nuevas constantes en la misma
//linea

//=============================================================================================
//Importandose una libreria externa de node llamada express-fileupload necesaria para la subida 
//y descarga de archivos de manera mas facil, asignandosele dicho paquete a la valiabra por nombre 
//expressFilePpload
//===========================================================================================
const expressFileUpload=require('express-fileupload')

//============================================================================================
//Por otra parte se importan todos los controladores correspondientes proceso de upload requieridos
//para los endpoints inicializados en esta carpeta const { uploadFile,downloadFile}, todos provenientes 
//de la carpeta de controlladores , especificamente de uploads
//==================================================================================================
const { uploadFile,downloadFile } = require("../controllers/uploads"); //importando del controlador de usuarios todo lo referente a la ruta
//o cada una de lloas rutas del controller para usario

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


//====================================================================================
//Por cuestiones propias de esta libreria se hace necesario especificar que la misma es usada
//por este module correspondiente a la Routerizacion de nuestros controladores , para ello 
//entonces a traves de dicha variable router se accede al middleware use , y como parametro 
//se le pasaria la libreria asiganda al la variable expressFileUpload previamente incializada
router.use(expressFileUpload())

// ===========================================================================
//Proceso de endopoint que demarca la logica para subir imagenes a la clleccion 
//y su lugar especifoc dentro de ellas
// ===========================================================================
router.put("/:type/:id", validateJwt, uploadFile); 
//Vease que en este caso simple,emente se hace alusion a la ruta madre ('/') apendizandosele
//los diferentes paramtros necesarios para su correcxta ejecucion segun los requerimientos del endpoint
//donde primero seria el tipo de coleccion (:type) , y segun el id del item especifico dentro de la 
//coleccion en donde se quiere alojar dicha imagen(:id), al ser este un proceso realizado por un 
//usuario se supone este logeado se hace necesario verificar que el mismo posee 
//un token que autorice dichas acciones de ahi necesario que se verifique mediante el middleware
//validateJwt dicha instancia , para posteriormente proceder a ejecutar el controller en cuestion 
//para esta endpoint

//============================================================================================
//Proceso de endopoint que demarca la logica para descargar imagenes de la colleccion 
//y su lugar especifoc dentro de ellas
//==================================================================================
router.get("/:type/:imagePath", downloadFile); 
//Al ser este un metodo de descarga u obtnecion se hace necesario utilizar el metodo get 
//haciendose alusion a la ruta madre ('/')apendizandosele
//los diferentes paramtros necesarios para su correcxta ejecucion segun los requerimientos del endpoint
//donde primero seria el tipo de coleccion (:type) , y segundo el path en donde deicha imagen que se 
//quiere obtener se encuentra alojada, como en el caso anterior para este proceso tambien
//es necesario que el usuario tenga autorizacion para realiar cualquier operacion , y para ello
 //se hace necesario que el mismo presente un token valido de ahi la inclusion del middleware
 //validateJwt, para posteriormentesi todo concurre proceder a ejecutar la variable que inicializa el 
 //controller , en este caso downloadFile

//=========================================================================================
//Exportando el router de este endpoint
//=========================================================================================
module.exports = router; //por ultimo se exporta porta la variable router que es al encargada de re
//sumir todos estos endpoints para su futuro uso en los demas modulos de la aplicacion , vease
//que dicha variable seria la inicializacion del proceso propio de express Router()
