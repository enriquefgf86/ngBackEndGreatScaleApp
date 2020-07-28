//En los controladores se desarrolla toda la logica propia de la reunion entre los middleware
//y los endpoint para cada ruta .En elllos se desarollan todas la funciones callbacks ,
//se triggerizan procesos , y se realiza todo lo referente al resultado final arrojado
//por la aplicacion

//==============================================================================================
//Al encontrarnos en el controlador correspondiente a todo lo referente con la collecion de
//hospital se hace necesario , importar la esquematizacion de dicha coleccion en la base de
//datos para entonces a partir de ella proceder con los diferentes procesos  del controlador,
//De ahi la trigerizacion de la variable Hospital , la cal es incialiazada mediante la importacion
//del esquema de hospitals del modulo de models
//=========================================================================================
var Hospital = require("../models/hospitals");
var User = require("../models/user");

//===========================================================================================
//Como recurso extra se importa de express uno de sus items propios , el item respnse , que no seria
//mas que un helper para la escritura de syntax de codigos amedida que vayamos desarrolladndo
//los algoritmos
//=================================================================================================
const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

////////////////////////////////////////////////////////////////////////////////////////
//////////////            INICIO DE LOS CONTROLADORES            ////////////////////////////

//========================================================================================
//Obteneindo todos los hospitales en este apartado se incializa el proceso de la obtencion
//de todos los hospitales dentor de la coleccion de hospitals, esto se le asigan previo a
//una variable la cual tendria por nombre getAllHospitals, y mediante erl retorno de una funcion callbACK
//trigerizaria el proceso
//=====================================================================================
const getAllHospitals = async (request, response = response, next) => {
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

  const allHospitals = await Hospital.find().populate("user", "name img email"); //en este caso vease que simplemente
  //sea accede a la colleccion completa de hospitales ademas , ser un poco mas especifcio y mediante la
  //fucnion de mongoose populate , se especifica que de dicha collecion traida de los hospitales es necesario
  //que se extraiga para cada uno  del apartado de user(traido en cada hospital) su nombre, email e imagen

  response.status(201).json({
    ok: true,
    msg: "getallHospitals",
    allHospitals,
  });
  //una vez pasado por este proceso de ser positivo entonces se arrojaria un response de
  //satus 2200(ok) con un mesaje que indica que todos los doctores fueron obtenidos con su respectiva
  //informacion , pasandose como data entoces el resultado del query anterior almacenado en la variable
  //inicializada con el nombre de allDoctors
};

//========================================================================================
//Creando el hospital
//=====================================================================================
const createAHospital = async (request, response, next) => {
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

  const userId = request.userId;
  const hospital = new Hospital({ user: request.userId, ...request.body }); //Vease que a continuacion se crean
  //2 constantes ,,la primera seria la encargada de recopilar todla la informacion traida en le request
  //especificamente en el apartado userId, asigandosele dicha data a una constante de igual nombre
  // en donde dicho requeste especificamente el parametro userid que vendria asigando de antemano
  //con un token valido , previamente calculado en  el middleware jwtMiddleware calculado en dicho modulo.
  //Luego se inicializa otra variable llamda hospital , la cual trigerizaria uun nuevo constructor de tipo
  //Hospital el cualen este caso asiganaria el token traido en el requet a traves de la variable
  //userId al item user del esquema de hospital en si , para eellos se desagrega el objeto en si
  //traido en el request body correspondiente a ese esquema de ...request.body, y se le asigan como
  //value al key user , todo lo correspondiente al userId traido en el request, lo cual incluyte token
  //validado , tiempo de validacion y demas

  console.log(request.userId);
  console.log(userId);
  console.log(hospital);
  console.log(request);

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    const hospitalDb = await hospital.save(); //como primer paso en este try , se procede a inicializar
    //una variable a la cual se le asigab por nombre hospitalDb, la cual entonces procederia a
    //salvar en mongo el nuevo esquema creado y asigando a la variable hospital  previamente
    //inicializada, esto mediante metodo save

    await response.status(201).json({
      ok: true,
      msg: "Hospital created",
      hospital: hospitalDb,
      user: userId,
    }); //para luego entonces proceder a dar un response positivo sobre dicho proceso
    //de creacion y guardado del nuevo esquema en la coleccion de hospitals, erogandose un
    //mensaje positvo asi como la data en especifico correspondiente a ese esquema creado en la
    //collecion de hospitals en la base de datos,en este caso almancenado en la variable hospitalDb,
    //como dato opcional tambien se adjunta otro key (user), el cual traeria toda la data referente
    //al usuario que lo crea a traves del userId traido con el token valido
  } catch (error) {
    //de lo contrario entonces en este catch se devolveria unu error
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
    //de no cumplirse el ciclo en el try entoces se procederia a entrar en el ciclo del
    //catch con su respectivo respnse de error  y su mensjae explicatico
  }
};

//========================================================================================
//Modificar el usuario
//=====================================================================================
const updateHospital = async (request, response = response) => {
  //Vease que se trigeriza dicho callback con 3 paramtros , request,
  //lo cual seria el acarraeador de variables informacion y demas traida
  //en el body  , o el header , o como params para el desarrollo de la aplicacion,
  //luego se establece el response , que npo seria mas que el parametro que acarrea en si las
  //diferentes respuestas que pudiesen suscitarse como resultado de una accion o desenlace
  //del metodo, y pudiesen traer respuestas validas o errores, segun la logica del proceso;
  //vease que este response se iguala o se le asigna el respnse traido de express
  //a manera de facilitrar la escritura del syntax; por ultimo , aunque mas usado
  //en los middelware vendria el parametro de next, lo cual daria continuidad a cualesquiera otro
  //proceso una vez terminado el proceso actual de manera satisfactoria

  const hospitalId = request.params.id; //designando el id traido por el hospital en el request de sus parametros d
  //previamente denotado en el archivo de routas para el hospital(/:id)el URL

  const userId = request.userId; //designando el id traido por el usuario en el request
  //de sus parametros oel URL proveido por el token

  const hospitalDb = Hospital.findById(hospitalId); //estableciendo la constante que de cierta
  //manera le seria asignada el id necesario para determinar con posterioridad si el id
  //existente existe para ese hospital o no, para ello se accede al modleo esquematico de Hospital
  //y a rtaves de el a l metodo findById(), pasandosele como paramtro la variable inicializada
  //anteriormente con el nombre de hospitalId, la cual traeria como data el id pasado como params por
  //ell usuario en el url

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    if (!hospitalDb) {
      return response.status(401).json({
        ok: false,
        msg: "Hospital Doesnt exist",
      });
    } //pasando lo anterior entonces se procede a erogar una respuesta negativa en caso de que dicho
    //hospital con dicha id no existiese, arrojando un status 400 , y un mensaje de negacion

    const hospitalModifcation = { ...request.body, user: userId }; //basicamente  se crea una constante
    //la cual desagrega todo el body traido en el request perteneciente al endpoint de modificar hospital
    //y con ella tambien se le asigna a uno de los items de ese body desagregado (user), el id del
    //usuario que acomete la modificacion , previamente traido en el requet despues de haber pasado
    //la validacion del token

    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      hospitalModifcation,
      { new: true }
    );
    //Esta manera manera de modificacion es un poco mas sencilla y abarcadora pues pposterior al paso
    //anterior en donde se desagrega  el body request , y se le asigana uno de sus items(user) el
    //id traido y validado por el token (userId), simplemente ya se acederia entocens al constructor de
    //hospital para modifcar y a traves de la funcion findByIdAndUpdate, como bien se dice
    //primero se pasaria el id del hospital en cuestion traido median el request params(hospitalId), luego
    //se pasarian los paremtros del update, los cuales se realizaron en el paso anterior , y por ultimo
    //entonces se inicializaria el template new:true lo cual regresaria el ultimo documento actulaizaod.
    //Todo esto asignandose a la variable updatedHospital

    await response.status(201).json({
      ok: true,
      msg: "Hospital Updated",
      hospital: updatedHospital,
    }); //trayendo entonces la respuesta positiva ya con el hospital actualizado si el proceso anterior
    //es valido
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  } //de lo contrario se caeria en el ciclo catch en donde se erogaria el error , con su respectivo mensaje
  //y demas
};

//========================================================================================
//borrar  el hospital
//=====================================================================================

const deleteHospital = async (request, response = response) => {
  //Vease que se trigeriza dicho callback con 3 paramtros , request,
  //lo cual seria el acarraeador de variables informacion y demas traida
  //en el body  , o el header , o como params para el desarrollo de la aplicacion,
  //luego se establece el response , que npo seria mas que el parametro que acarrea en si las
  //diferentes respuestas que pudiesen suscitarse como resultado de una accion o desenlace
  //del metodo, y pudiesen traer respuestas validas o errores, segun la logica del proceso;
  //vease que este response se iguala o se le asigna el respnse traido de express
  //a manera de facilitrar la escritura del syntax; por ultimo , aunque mas usado
  //en los middelware vendria el parametro de next, lo cual daria continuidad a cualesquiera otro
  //proceso una vez terminado el proceso actual de manera satisfactoria

  const userId = request.params.userId; //trayendo a traves del token el id del usuario que acomete
  //la eliminancion del doctor a traves del request accediendose al userId previante cargado con
  //este valor mediante el validatetken fucntion hecha en el middleware , inicializada antes de cualquier
  //controller
  const hospitalId = request.params.id; //establecciendo en una constante el id escrito
  //por el usuario  mediante el requet params de la ruta del servicio que sugiere dicha
  //actualizacion(/:id)

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    const hospital = await Hospital.findById(hospitalId); //estableciendo la constante que de cierta
    //manera le seria asignada el id necesario para determinar con posterioridad si el id
    //existente existe para ese hospital o no, para ello se accede al modelo esquematico de Hospital
    //y a rtaves de el a l metodo findById(), pasandosele como paramtro la variable inicializada
    //anteriormente con el nombre de hospitalId, la cual traeria como data el id pasado como params por
    //ell usuario en el url

    if (!hospital) {
      return response.status(401).json({
        ok: false,
        msg: "Hospital has been deleted",
      }); //pasando lo anterior entonces se procede a erogar una respuesta negativa en caso de que dicho
      //hospital con dicha id no existiese, arrojando un status 400 , y un mensaje de negacion
    }

    await Hospital.findByIdAndDelete(hospitalId);
    //De  o ser asi ,y si existir un hospital con el id pasado a traves del request, entonces se procederia
    //a acceder la colleccion esquematica de hospitals(Hospital), y de ella inicializar el metodo findByIdAndDelete
    //pasandole como parametro la variable previemnte incializada con el valor del id traido a traves del params

    response.status(201).json({
      ok: true,
      msg: "Hospital has been deleted",
    });
    //Se procede a erogar una respuesta positiva de todo el proceso culminando conexito
    //dando como mensaje el borrado del usuaro y el status 200 d ela operacion
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  } //de lo contrario se caeria en el ciclo catch en donde se erogaria el error , con su respectivo mensaje
  //y demas
};

module.exports = {
  getAllHospitals,
  createAHospital,
  updateHospital,
  deleteHospital,
}; //Exportandose todos los controladores de este esquema(Doctor), para su posetrior uso en las demas dependencias
