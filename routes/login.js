//Este seria el apartado de incializar todos los endpoints referentes a el proceso de
//login del usuario ya sea mediante login tradicional o cuenta de google

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
//para los endpoints inicializados en esta carpeta const { loginUser ,loginUserGoogle, loginUserTokenRenew,
//   todos provenientes de la carpeta de controlladores , especificamente delogin
//==================================================================================================
const {
  loginUser,
  loginUserGoogle,
  loginUserTokenRenew,
} = require("../controllers/login");

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
// Estableciendo la ruta para para loggear el usuario de manera convencional
// ===========================================================================
router.post(
  "/",
  [
    check("email", "Email is obligatory").isEmail(),
    check("password", "Password is Obligatory").not().isEmpty(),
    fieldValidator,
  ],
  loginUser
);
//vease que primero se establece el tipo de metodo(post), y en el se pasa el route madre,
//o sea el del app.js('/'),, al ser este un login no es necesario establecer
//validaciones de token , por lo que acto seguido se pasa al segundo middleware de check
//proveniente de express validator , corresppndiente a los cmapos de email y pasword propios
//del login de cualquier aplicacion , en donde para el primero se accede a;l metodo isEmail()
//requireindo que sean caracteristicas propiuas d ewun email para ser validado, y el segundo
//campo al ser un password simplemente se requeriria que no estuviese vacio, de ahi la triggeriuzacion
//de los metodos not().isEmpty(), Luego verificandose que los campos en si han sido llenados
//correctamente , se procede a llamra a la variable que encierra la fucnion de middleware  para
//la validacion de cada uno de dichos checks fieldValidator; para posteriormente de realizarse el
//proceso anterior dara paso a a la ejecucion del controller propio de este endpoint especifico
//loginUser

// ===========================================================================
// Estableciendo la ruta para para loggear el usuario a traves de google
// ===========================================================================
router.post(
  "/google",
  [check("token", "Token is neccesary").not().isEmpty(), fieldValidator],
  loginUserGoogle
); //ruta especoificada para el usuario que desee autentificarse mediante google
////vease que primero se establece el tipo de metodo(post), y en el se pasa el route madre,
//o sea el del app.js('/'), aunque en este caso tambien se apendiza la palabra google , lo cual
//haria referencia al ti[po de login mediante el cual se registra el usuario, o sea a traves de google
// al ser este un login no es necesario establecer validaciones de token , por lo que acto seguido se pasa al segundo middleware de check
//proveniente de express validator , se inicializan los chequeadores del express0-validator sobre
//cualesquiera los campos disenaods para este end-point especifoc, que en este caso seria uno solo
//token, especificandose que el mismo no se encuentre vacio  de ahi la triggerizacion
//de los metodos not().isEmpty(),sobre dicho checker ,complementado por la fucnion
//de middleware fieldValidator para la correcta validacion de dichos campos  requeridos .
//Una vez logardo esto se procede entonces a la trigerizacion de la fucnion proveniente del
//controller para este aprtado en particular o sea loginUserGoogle

// ===========================================================================
// Estableciendo la ruta para para renovar del usuario loggeado , que seria una
//especie de autologin renovando token
// ===========================================================================
router.get("/renew", validateJwt, loginUserTokenRenew);
//renovando el token del usuario autentificado.
//Este proceso es bastante sencillo simplemente se procede a establecer el tipo de metodo
// que demarcara este endpoint(get), que obtendria un un nuevo token a usar por el usuario.
//Vease que en este caos si es necesario que el usuario tenga un previo token , pues de lo contrario
//seria raro actulaizar un token no existente , de ahi que se inicialize el middleware que valida
//dicho token validateJwt, una vez verificado dicho token a remplazar , y no existir ningun problema
//se procederia entonces a la ejecucion del controler especifico para dicha accion
//eneste caso loginUserTokenRenew

//=========================================================================================
//Exportando el router de este endpoint
//=========================================================================================
module.exports = router; //por ultimo se exporta porta la variable router que es al encargada de re
//sumir todos estos endpoints para su futuro uso en los demas modulos de la aplicacion , vease
//que dicha variable seria la inicializacion del proceso propio de express Router()
