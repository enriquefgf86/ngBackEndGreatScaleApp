//Esta seria el route correspondiente al modulo de user , en ella se encerrarian todos
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
//Por otra parte se importan todos los controladores correspondientes al Crud de doctor requieridos
//para los endpoints inicializados en esta carpeta const { getAllusers, createAuser,  updateuser,
//  deleteuser}, todos provenientes de la carpeta de controlladores , especificamente de userss
//==================================================================================================
const {
  getAllUsers,
  createAUser,
  updateUser,
  deleteUser,
} = require("../controllers/users"); //importando del controlador de usuarios todo lo referente a la ruta
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
//Tambien aunque no se usa se importa la variable esquematica de tipo User traida desde
//los archivos de models correspondidente al aprtado de users
//=======================================================================================
var User = require("../models/user");

//=========================================================================================
//se importa el middelware validateJwt de la carpetas de middleware jwtMiddleware , lo cual
//verificaria antes de acceder a culaquier endpoint y su respectiva fucnionalidad , si el token
//que presenta el usuario en cuestion para accionar es valido o no , este middleware seria el
//encargado de constatar y autorizar el siguiente paso en la operacion o no teniendo en
//cuenta la validez del token, por otra parte tambien se importra el validador de role
//el cual se encargaria de traer o verificar si el usuario que se analiza para cada uno de
//los endpoints en su role presenta las caracteristicas necesarias para ciertos permisos
//o no , usandose este middleware como extrsa verificante en cada uno de los endpoints
//=======================================================================================
const {
  validateJwt,
  validAdminRole,
  validAdminRoleOrUser,
} = require("../middleware/jwtMiddleware");

///////////////////////////////////////////////////////////////////////////////////
////////////////        RUTAS O END-POINTS       //////////////////////////////////

// ===========================================================================
// Estableciendo la ruta para obtener la data de esta ruta obteniendo
//todos los usuarios
// ===========================================================================
router.get("/", validateJwt, getAllUsers); //Obtener todos los usuarios
//vease que primero se establece el tipo de metodo(get), y en el se pasa el route madre,
//o sea el del app.js('/'), una vez llegado a ese punto se haria necesario constatar si
//efeftivamente el usuario que hace la peticion tiene autorizacion alguna
//para desarrollar dicho acometido, de ahi que para ello sea necesario utilizar el middelware
//validateJwt previemente importado, para la comprobacion de token, de ser asi entonces como tercer
//paso se llamaria al controlador que ejecuta la accion previamente tambien importado de la car
//peta de controladores(getAllUsers)

// ===========================================================================
// Estableciendo la ruta para crear un usuario
// ===========================================================================
router.post(
  "/",
  [
    check("email", "email is obligatory").isEmail(),
    check("name", "name is obligatory").not().isEmpty(),
    check("password", "password is obligatory").not().isEmpty(),
    check("role", "role is obligatory").not().isEmpty(),

    fieldValidator, //grabando o constatatando no exite ningun error en validacion
    //vease que se debe poner despues de los middle ware de check
  ],
  createAUser
); //Crear un usuario
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
//(name, email, password,role), y como segundos parametros se inicializan mensajes que demanda su correcto
//llenando.Vease que para el caso del password,role y name  , actoseguido se inicializan los metodos
//not().isEmpty() especificando la no admision de valores nulos o vacios
//y en elcaso de email se verifica si dicho campo es llenado bajo los requerimientos de un email
//de ahi la triggerizacion del metodo propio del chekc isEmail().
//Pasado estos  checks del segundo middleware, entrariamos enonces en el comprobador que seria
//el encargado de validar los checks previos , o sea el fieldvalidator, siempre debe ser asi ,
//entoces de no existor ningun problema y demas llamar por ultimo a la ejecucion del controlador
//en este csaso especifico para la fucnio asignada a la variable de nombre  createAUser

//==========================================================================
// Estableciendo la ruta para modificar usuario
// ===========================================================================
router.put(
  "/:id",
  validateJwt,
  validAdminRoleOrUser,
  [
    check("email", "email is obligatory").isEmail(),
    check("name", "name is obligatory").not().isEmpty(),
    check("role", "role is obligatory").not().isEmpty(),

    fieldValidator, //grabando o constatatando no exite ningun error en validacion
    //vease que se debe poner despues de los middle ware de check
  ],
  updateUser
); //Obtener todos los usuarios
//Este proceso no difiere mucho del anterior , aunque en este caso la ruta madre al ser requeriuda
//mediante ,metodo put requeriria que se especifique a que arcivo es al que se le va a hacer dicha modificacion
//de ahi que se le apendice a la misma el parametro(params) :id haciendo referencia al id del usuario
//al cual se le hace la modificacion en si. Por lo demas se establecen los middleware necesarios
//para especificar y indicar los campos a modificar asi como su validacion , ademas de
//establecerse el middleware que se ceciora para esta ruta si con el role que
//el usuario tre es permisible hacer lo que este endpoint tiene  como funcion
//en donde de no ser asi , ya en elmiddleware se inicializaron posibles respuesta sy demas
//y por ultimo se hace  referencia  al controller encargado de toda la logica opercional(updateUser)
//en este caso no se permitiria que un usuario sin rol de administrador o con un id similar
//al usuario loggeado se haga algun cambio
//==========================================================================
// Estableciendo la ruta para borrar usuario
// ===========================================================================
router.delete("/:id", [validateJwt, validAdminRole], deleteUser);
//Este ultimo proceso es muy parecido a los dos anteriores , aunque en este caso , al tratartse
//de eliminar un registor no se necesita middleware de check alguno , simplemente se verifica que
//el usario que intenta elminar algo esta autorizado mediante token valido validateJwt, admeas de que se
//especifica en la ruta , el parametro que traeria el id del suer seleccionado para su eliminacion
//:id, por ultimo se hace referencia al controller que ejeucta la accion( deleteUser) y ya esta

//=========================================================================================
//Exportando el router de este endpoint
//=========================================================================================
module.exports = router; //por ultimo se exporta porta la variable router que es al encargada de re
//sumir todos estos endpoints para su futuro uso en los demas modulos de la aplicacion , vease
//que dicha variable seria la inicializacion del proceso propio de express Router()
