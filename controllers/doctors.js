//En los controladores se desarrolla toda la logica propia de la reunion entre los middleware
//y los endpoint para cada ruta .En elllos se desarollan todas la funciones callbacks ,
//se triggerizan procesos , y se realiza todo lo referente al resultado final arrojado
//por la aplicacion

//==============================================================================================
//Al encontrarnos en el controlador correspondiente a todo lo referente con la collecion de
//doctor se hace necesario , importar la esquematizacion de dicha coleccion en la base de
//datos para entonces a partir de ella proceder con los diferentes procesos  del controlador,
//De ahi la trigerizacion de la variable Doctor , la cal es incialiazada mediante la importacion
//del esquema de doctors del modulo de models
//=========================================================================================
var Doctor = require("../models/doctors");

//===========================================================================================
//Como recurso extra se importa de express uno de sus items propios , el item respnse , que no seria
//mas que un helper para la escritura de syntax de codigos amedida que vayamos desarrolladndo
//los algoritmos
//=================================================================================================
const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
const { IdTokenClient } = require("google-auth-library");
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

////////////////////////////////////////////////////////////////////////////////////////
//////////////            INICIO DE LOS CONTROLADORES            ////////////////////////////

//========================================================================================
//Obteneindo todos los doctores en este apartado se incializa el proceso de la obtencion
//de todos los doctores dentor de la coleccion de doctors, esto se le asigan previo a
//una variable la cual tendria por nombre getAllDoctors, y mediante erl retorno de una funcion callbACK
//trigerizaria el proceso
//=====================================================================================
const getAllDoctors = async (request, response = response, next) => {
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

  const allDoctors = await Doctor.find({}, "name  img")
    .populate("hospital", "name")
    .populate("user", "name img email");
  //vease que en este aprtado simplemente se accde al esquema de doctors, y como bien se
  //expone en este metodo se pretende traer toda la coleecion de doctors existentes, de ai que se
  //inicialice el metodo find, en donde se pasa como parametros un objeto vacio (haciendo alusion
  //a que se extraigan todos los items dentro de la coleccion sin excepcion), y como segundo parmaetro
  //se planete que de todos esos items para cada uno de ellos solamente se muestre la informacion
  //correspondiente a keys especificas, en este caso la key de name y la de img , propias del esquema
  //de doctors.Vease que tambie se especifica mediante el metodo populate , que elementos
  //de los otros keys pertenecientes al esquema de doctor deberan sen mostrados o que informacion
  //deberan mostrar;vease entonces que para el caso de hospital, se especifica que solamente
  //se muetstre el nombre del hospital al cual ese doctor pertenece; y en el caso del key
  //user que hace referencia al usuario que creo ese doctor , se especifica que muestre tanto
  //el nombre como la img del mismo asi como su email

  response.status(201).json({
    ok: true,
    msg: "getting all doctors",
    allDoctors,
  }); //una vez pasado por este proceso de ser positivo entonces se arrojaria un response de
  //satus 2200(ok) con un mesaje que indica que todos los doctores fueron obtenidos con su respectiva
  //informacion , pasandose como data entoces el resultado del query anterior almacenado en la variable
  //inicializada con el nombre de allDoctors
};
// =========================================================================================
// Obtener un medico en especifico por Id
// =========================================================================================
const getDoctorById = async (request, response = response) => {
  const doctorId = request.params.idDoctor; //trayendo enntoces el id del doctor a modificar en cuestion
  //pasod mediante el requet param de la ruta del servicio que sugiere dicha actualizacion(/:idDoctor)

  const userId = request.userId; //designando el id traido por el usuario en el request
  //de sus parametros oel URL proveido por el token

  try {
    const doctor = await Doctor.findById(doctorId)
      .populate("user", "name img id")
      .populate("hospital", "name id img");

    if (!doctor) {
      return response.status(404).json({
        ok: false,
        msg: "Doctor Not Found",
      });
    }

    await response.status(201).json({
      ok: true,
      msg: "Doctor Found",
      doctor,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    }); //de no cumplirse el ciclo en el try entoces se procederia a entrar en el ciclo del
    //catch con su respectivo respnse de error  y su mensjae explicatico
  }
};

//========================================================================================
//Creando el usuario  controller
//=====================================================================================
const createADoctor = async (request, response, next) => {
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
  const doctor = new Doctor({ user: userId, ...request.body }); //Vease que a continuacion se crean
  //2 constantes ,,la primera seria la encargada de recopilar todla la informacion traida en le request
  //especificamente en el apartado userId, asigandosele dicha data a una constante de igual nombre
  // en donde dicho requeste especificamente el parametro userid ya =vendria asigando de antemano
  //con un token valido , previamente calculado en  el middleware jwtMiddleware .
  //Luego se inicializa otra variable llamda doctor , la cual trigerizaria uun nuevo constructor de tipo
  //Doctor el cualen este caso asiganaria el token traido en el requet a traves de la variable
  //userId al item user del esquema de doctor en si , para eellos se desagrega el objeto en si
  //traido en el request body correspondiente a ese esquema de ...request.body, y se le asigan como
  //value al key user , todo lo correspondiente al userId traido en el request, lo cual incluyte token
  //validado , tiempo de validacion y demas

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    const doctorDb = await doctor.save(); //como primer paso en este try , se procede a inicializar
    //una variable a la cual se le asigab por nombre doctorDb, la cual entonces procederia a
    //salvar en mongo el nuevo esquema creado y asigando a la variable doctor  previamente
    //inicializada, esto mediante metodo save

    await response.status(201).json({
      ok: true,
      msg: "Doctor created",
      doctor: doctorDb,
    }); //para luego entonces proceder a dar un response positivo sobre dicho proceso
    //de creacion y guardado del nuevo esquema en la coleccion de doctors, erogandose un
    //mensaje positvo asi como la data en especifico correspondiente a ese esquema creado en la
    //collecion de doctros en la base de datos,en este caso almancenado en la variable doctorDb
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    }); //de no cumplirse el ciclo en el try entoces se procederia a entrar en el ciclo del
    //catch con su respectivo respnse de error  y su mensjae explicatico
  }
};
//========================================================================================
//Modificar el usuario
//=====================================================================================
const updateDoctor = async (request, response = response) => {
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

  const doctorId = request.params.idDoctor; //trayendo enntoces el id del doctor a modificar en cuestion
  //pasod mediante el requet param de la ruta del servicio que sugiere dicha actualizacion(/:idDoctor)

  const userId = request.userId; //designando el id traido por el usuario en el request
  //de sus parametros oel URL proveido por el token

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    const doctorDb = await Doctor.findById(doctorId); //estableciendo la constante que de cierta
    //manera le seria asignada el id necesario para determinar con posterioridad si el id
    //existente existe para ese doctor o no, para ello se accede al modleo esquematico de Doctor
    //y a rtaves de el a l metodo findById(), pasandosele como paramtro la variable inicializada
    //anteriormente con el nombre de doctorId, la cual traeria como data el id pasado como params por
    //ell usuario en el url

    if (!doctorDb) {
      return response.status(400).json({
        ok: false,
        msg: "doctor  doesn't exist",
      });
    } //pasando lo anterior entonces se procede a erogar una respuesta negativa en caso de que dicho
    //doctor con dicha id no existiese, arrojando un status 400 , y un mensaje de negacion

    const doctorModified = await { ...request.body, user: userId }; //desagregando el body y todos los elementos
    //que en el se traigan para modificar al doctor , para entonces una vez hecho esto proceder a la
    //actualizacion del mismo , vease que uno de los paramtros desagregados seria el user, y se le
    //asiganria al mismo el user correspondiente al id traido en el token despues de validar(userId)

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      doctorModified,
      { new: true }
    );
    //Esta manera manera de modificacion es un poco mas sencilla y abarcadora pues pposterior al paso
    //anterior en donde se desagrega  el body request , y se le asigana uno de sus items(user) el
    //id traido y validado por el token (userId), simplemente ya se acederia entocens al constructor de
    //doctor para modifcar y a traves de la funcion findByIdAndUpdate, como bien se dice
    //primero se pasaria el id del docotor en cuestion traido mediante el request params(doctorId), luego
    //se pasarian los paremtros del update, los cuales se realizaron en el paso anterior , y por ultimo
    //entonces se inicializaria el template new:true lo cual regresaria el ultimo documento actulaizasdo,
    //ya con los cambia hechos

    await response.status(201).json({
      ok: true,
      msg: "Doctor Updated",
      doctor: updatedDoctor,
    }); //trayendo entonces la respuesta positiva ya con el doctor actualizado si el proceso anterior
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
//borrar  el doctor
//=====================================================================================
const deleteDoctor = async (request, response = response) => {
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

  const userId = request.userId; //trayendo a traves del token el id del usuario que acomete
  //la eliminancion del doctor a traves del request accediendose al userId previante cargado con
  //este valor mediante el validatetken fucntion hecha en el middleware , inicializada antes de cualquier
  //controller

  const doctorId = request.params.idDoctor; //establecciendo en una constante el id escrito
  //por el usuario  mediante el requet params de la ruta del servicio que sugiere dicha
  //actualizacion(/:idDoctor)

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    const doctorDb = await Doctor.findById(doctorId); //estableciendo la constante que de cierta
    //manera le seria asignada el id necesario para determinar con posterioridad si el id
    //existente existe para ese doctor o no, para ello se accede al modleo esquematico de Doctor
    //y a rtaves de el a l metodo findById(), pasandosele como paramtro la variable inicializada
    //anteriormente con el nombre de doctorId, la cual traeria como data el id pasado como params por
    //ell usuario en el url

    if (!doctorDb) {
      return await response.status(404).json({
        ok: false,
        msg: "doctor doesn't exist",
      }); //pasando lo anterior entonces se procede a erogar una respuesta negativa en caso de que dicho
      //doctor con dicha id no existiese, arrojando un status 400 , y un mensaje de negacion
    }
    await Doctor.findByIdAndDelete(doctorId);
    //De  o ser asi ,y si existir un doctor con el id pasado a traves del request, entonces se procederia
    //a acceder la colleccion esquematica de doctors(Doctor), y de ella inicializar el metodo findByIdAndDelete
    //pasandole como parametro la variable previemnte incializada con el valor del id traido a traves del params

    response.status(201).json({
      ok: true,
      msg: "Doctor has been deleted",
    }); //Se procede a erogar una respuesta positiva de todo el proceso culminando conexito
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
  getAllDoctors,
  createADoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
}; //Exportandose todos los controladores de este esquema(Doctor), para su posetrior uso en las demas dependencias
