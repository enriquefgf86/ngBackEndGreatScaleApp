//Esta seria el route correspondiente al modulo de hospital , en ella se encerrarian todos
//los procesos que barcan el CRUD para este modulo en especifico

// =======================================================================
// Al igual que en el root app es necesario importar express node para establecer
// la fucnionalidad del backend de node, pero especificamente en vez de importarolo
//todo se hace referencia a uno de sus librerias especificas ,en este caso la de ROuter
// =======================================================================
const { Router } = require("express"); //importando express asignandosleea una variable constante llamada Router
//vease que la variable se encierra en parentesis a manera de desagregacion
//en caso de que a futuro se pretendan insertar nuevas constantes en la misma
//linea

//============================================================================================
//Por otra parte se importan todos los controladores correspondientes al Crud de hospital requieridos
//para los endpoints inicializados en esta carpeta const { getAllHospitals, createAHospital, updateHospital,
// deleteHospital, todos provenientes de la carpeta de controlladores , especificamente de hospitals
//==================================================================================================

const {
  getAllHospitals,
  createAHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospital"); //importando del controlador de usuarios todo lo referente a la ruta
//o cada una de lloas rutas del controller para usario

//=================================================================================================
//En este aprtado se importa del paquete de la libreria de express validator , especificamente
//el item check(OJO este no se pone a voluntad pues es un paquete existente dentro de la libreria)
//de ahi que se desagreue {} y se invoke como constante de dicha libreria {check}
//====================================================================================================
const { check } = require("express-validator"); //importando el middleware check del paquete de express-validator
//muy util para validar campos y demas en el back

//===========================================================================================
//Se importa la funcion a siganda a la variable fieldValidator de la carpeta de middleware
//llamada validationFileds, necesaria para validar los campos que mediante el middlre weare
//express validator sean requeridos
//============================================================================================
const { fieldValidator } = require("../middleware/validationFields"); //importando field validation funcion del midelware creado
//validationField , el mismo se utiliza para ya de antemano tener generadas
//respuestas , lo cual haria menos trabajoso escribir el codigo , pues en la logica
//se escribe simplemente una vez( en la carpeta middle ware en este caso ) y ya
//despues se procederia a importarlo en dondequieres aque se use

//=======================================================================
//se inicializa en este apartado la constante router que le daria routerizacion a este modulo
//del paquete de express especificamente de la libreria Router()previamente requerida
//e inicializada como constante const { Router }
//========================================================================
const router = Router(); //inicializando la constante Router previamente requerida en este apartado
//de rutas a traves de express

//=========================================================================================
//Tambien aunque no se usa se importa la variable esquematica de tipo Hospital traida desde
//los archivos de models correspondidente al aprtado de doctors
//=======================================================================================
var Hospital = require("../models/hospitals");

//=========================================================================================
//se importa el middelware validateJwt de la carpetas de middleware jwtMiddleware , lo cual
//verificaria antes de acceder a culaquier endpoint y su respectiva fucnionalidad , si el token
//que presenta el usuario en cuestion para accionar es valido o no , este middleware seria el
//encargado de constatar y autorizar el siguiente paso en la operacion o no teniendo en
//cuenta la validez del token
//=======================================================================================
const { validateJwt } = require("../middleware/jwtMiddleware");

///////////////////////////////////////////////////////////////////////////////////
////////////////        RUTAS O END-POINTS       //////////////////////////////////

// ===========================================================================
// Estableciendo la ruta para obtener la data de esta ruta obteniendo
//todos los hospitales
// ===========================================================================
router.get("/", validateJwt, getAllHospitals); //Obtener todos los hospitales

//vease que primero se establece el tipo de metodo(get), y en el se pasa el route madre,
//o sea el del app.js('/'), una vez llegado a ese punto se haria necesario constatar si
//efeftivamente el usuario que hace la peticion tiene autorizacion alguna
//para desarrollar dicho acometido, de ahi que para ello sea necesario utilizar el middelware
//validateJwt previemente importado, para la comprobacion de token, de ser asi entonces como tercer
//paso se llamaria al controlador que ejecuta la accion previamente tambien importado de la car
//peta de controladores(getAllHospitals)

// ===========================================================================
// Estableciendo la ruta para crear un hospital
// ===========================================================================
router.post(
  "/",
  validateJwt,
  [
    check("name", "Hospital name is obligatory").not().isEmpty(), //determinando que el aprtdo de name no
    //vacio

    fieldValidator, //grabando o constatatando no exite ningun error en validacion
    //vease que se debe poner despues de los middle ware de check
  ],
  createAHospital
); //Crear un hospital
//vease que primero se establece el tipo de metodo(post), y en el se pasa el route madre,
//o sea el del app.js('/'), una vez llegado a ese punto se haria necesario constatar si
//efeftivamente el usuario que hace la peticion tiene autorizacion alguna
//para desarrollar dicho acometido, de ahi que para ello sea necesario utilizar el middelware
//validateJwt previemente importado, para la comprobacion de token,en este especifico caso
//al ser un metodo post , en el body de dicha accion deben venir ciertos parametros que deben ser
//verificados antes de dar cualquier otro paso , de ahi que se establezca un segundo middleware que
//controloe cada uno de stos campos, que al ser mas de uno se hace necesario que se inicalicen dentro
//de un array ,para ello se invoca al metodo check previamente importado de la librewria de
//express-validator, y como parametro primero se le pasa el item del body sobre el cual se chequea
//(name), y como segundos parametros se inicializan mensajes que demanda su correcto
//llenado.Vease que paraeste caso , actoseguido se inicializan los metodos
//not().isEmpty() especificando la no admision de valores nulos o vacios
//Pasado estos check del segundo middleware, entrariamos enonces en el comprobador que seria
//el encargado de validar los checks previos , o sea el fieldvalidator, siempre debe ser asi ,
//entoces de no existir ningun problema y demas llamar por ultimo a la ejecucion del controlador
//en este csaso especifico para la fucnio a siganda a la variable de nombre createAHospital

//==========================================================================
// Estableciendo la ruta para modificar hospital
// ===========================================================================
router.put(
  "/:id",
  validateJwt,

  [
    check("name", "name is obligatory").not().isEmpty(),

    fieldValidator, //grabando o constatatando no exite ningun error en validacion
    //vease que se debe poner despues de los middle ware de check
  ],
  updateHospital
); //Modificando el hospital especificamente en el parametro  de name que se supone sea el
//unico elemento modificable puesto qe la imagen ya tiene un servicio propio para modificarla
//Este proceso no difiere mucho del anterior , aunque en este caso la ruta madre al ser requeriuda
//mediante ,metodo put requeriria que se especifique a que arcivo es al que se le va a hacer dicha modificacion
//de ahi que se le apendice a la misma el parametro(params) :id haciendo referencia al id del hospital
//al cual se le hace la modificacion en si. Por lo demas se establecen los middleware necesarios
//para especificar y indiacr los campos a modificar asi como su validacion , y por ultimo se hace
// referencia  al controller encargado de todoa la logica opercional(updateHospital)

//==========================================================================
// Estableciendo la ruta para borrar hospital
// ===========================================================================
router.delete("/:id", validateJwt, deleteHospital);
//Este ultimo proceso es muy parecido a los dos anteriores , aunque en este caso , al tratartse
//de eliminar un registor no se necesita middleware de check alguno , simplemente se verifica que
//el usario que intenta elminar algo esta autorizado mediante token valido validateJwt, admeas de que se
//especifica en la ruta , el parametro que traeria el id del hospital seleccionado para su eliminacion
// /:id, por ultimo se hace referencia al controller que ejeucta la accion y ya esta (deleteHospital)

//=========================================================================================
//Exportando el router de este endpoint
//=========================================================================================
module.exports = router; //por ultimo se exporta porta la variable router que es al encargada de re
//sumir todos estos endpoints para su futuro uso en los demas modulos de la aplicacion , vease
//que dicha variable seria la inicializacion del proceso propio de express Router()
