// esta es la carpeta ruta del proyecto back end y a traves de ella se accede a las demas dependencias del proyecto
// por no nombre a este repositorio se le llama app, y en lella se inicializan varios paquetes 
//  que serian de uso del resto de la applicacion

// ==============================================================================
//Siempre en cada dependencia de la aplicacion de express es necesario primero 
//importar todos los requires que dicha dependencia necesitaria para su funcionamiento
//o sea imports
// Requires
// ===============================================================================
const express = require("express"); //siempre express sera necesario de ahi que se importe como primero

require("dotenv").config(); //determinando el uso de la variables de entorno en este caso accediendose a traves del pa
//quete de node al paquete dotenv encargado de manejo de variables de entorn0

const cors = require("cors");//Instalando cors, lo cual seria una libreria de node necesaria para permitir 
//acceso a nuestra api desde cualquier sitio

const { connection } = require("./database/config"); //importando la variable de conexion inicializada en config.js
//la cual utiliza mongoose para aceder a la base de datos de mongo atlas.
//Vease que se inicializa la variable a manera de llaves pues se
//desagrega en caso de querer adicionar a dicha constante mas
//elementos en un futuro
var bodyParser = require("body-parser");//inicializando la variable body parser necearia para la descifre de codigos json 
//y demas 

//=======================================================================
// Una vez importados los requeirmientos se hace necesario inicializar las variables que de una forma u otra 
// serian las encargadas de triggerizar la accion .
//inicializando variables
//========================================================================
const app = express(); //inicializando aplicacion de express la mas importante y necesaria para el arrancado de la dependencia

//=======================================================================
//conectando a la base de datos con ayuda de mongoose
//=======================================================================
connection(); //Para ello se utiliza la variable previamente importada de archivo config(connection)
//y se inicializa en este apartado

//============================================================================
//Body parser para tratar automaticamente elementos json y codificados
//sin precisamente hardcodear
//====================================================================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.json());

//==================================================================
//Configurando la ruta del cors a traves del use de app
//========================================================================
app.use(cors());

//============================================================================
//Rutas de app raiz:aqui se establece la ruta del app raiz('/') de ella entonces
//se originarian la demas 
//============================================================================
app.get("/", (request, response, next) => {
  response.status(200).json({
    ok: true,
    message: "request correct",
  });
});

//=========================================================================
//estableciendo las rutas importadas desde los modulos
//user,login.hospitals,doctors.....todas estas rutas son creadas 
//en la carpeta de routes  e importadas a manera de middleware mediante
//funcion use canalizandolas a traves de esta la dependencia principal
//app
//========================================================================
app.use("/user",require('./routes/user') );
app.use("/login",require('./routes/login'));
app.use("/hospital",require('./routes/hospital'));
app.use("/doctor",require('./routes/doctor'));
app.use("/allSearch",require('./routes/generalSearch'))
app.use("/upload",require('./routes/uploads'))





  //=======================================================================
  //escuchando peticiones, o levantando el servidor de node, mediante este apartado em
  //la raiz del proyecto...vease que en el mismo se establece , el numero de
  //al cual el server se conecta(3000), y como segundo argumento se pasa un callback
  //en donde como referencia para el usuario de saber si se conecto o no 
   //despliega un string , especificandose el color en qure debe 
   //salir la palabra online [\x1b[32m%s\x1b[0m"](verde)
  //========================================================================
  app.listen(3000, () => {
    console.log(
      "Express server running on port 3000:\x1b[32m%s\x1b[0m",
      "online"
    );
  });
