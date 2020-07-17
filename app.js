//creandose la importacion de librerias para que funcionen ciertas dependencias ,
//se le llamara Requires
// ==============================================================================
// Requires
// ===============================================================================

const express = require("express"); //siempre express sera necesario de ahi que se importe como primero

require("dotenv").config(); //determinando el uso de la variables de entorno en este caso accediendose a traves del pa
//quete de node al paquete dotenv encargado de manejo de variables de entorn

const cors = require("cors");//Instalando cors, lo cual seria una libreria de node necesaria para permitir 
//acceso a nuestra api

const { connection } = require("./database/config"); //importando la variable de conexion inicializada en config.js
//la cual utiliza mongoose para aceder a la base de datos de mongo atlas.
//Vease que se inicializa la variable a manera de llaves pues se
//desagrega en caso de querer adicionar a dicha constante mas
//elementos en un futuro
var bodyParser = require("body-parser");

//=======================================================================
//inicializando variables
//========================================================================
const app = express(); //inicializando aplicacion de express

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
//Rutas de app raiz
//============================================================================
app.get("/", (request, response, next) => {
  response.status(200).json({
    ok: true,
    message: "request correct",
  });
});

// ==================================================================
// importando la ruta creada asignadosele a una variable
// ==================================================================
var loginRoutes = require("./routes/login");
var appRoutes = require("./routes/app");
var userRoutes = require("./routes/user");
var hospitalRoutes = require("./routes/hospital");
var doctorRoutes = require("./routes/doctor");
var generalSearchRoutes = require("./routes/generalSearch");
var uploadRoutes = require("./routes/uploads");
var downloadRoutes = require("./routes/downloads");

//=========================================================================
//estableciendo las rutas importadas desde los modulos
//========================================================================
app.use("/user",require('./routes/user') );
app.use("/login",require('./routes/login'));

// app.use("/login", loginRoutes);

// app.use("/hospital", hospitalRoutes);

// app.use("/doctor", doctorRoutes);

// app.use("/search", generalSearchRoutes);

// app.use("/uploads", uploadRoutes);

// app.use("/download", downloadRoutes);

app.use("/", appRoutes), //vease que en este caso se hace referencia a la importada desde el modulo routes
  //haciendo referencia en este casoa la variable a la cual  le fue asifnada
  //appRooutes, especificandose que la misma se triggerizaria si la ruta
  //seleccionada por el usuario es ('/')

  //=======================================================================
  //escuchando peticiones, o levantando el servidor de node
  //========================================================================
  app.listen(3000, () => {
    console.log(
      "Express server running on port 3000:\x1b[32m%s\x1b[0m",
      "online"
    );
  });
