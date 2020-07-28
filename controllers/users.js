//En los controladores se desarrolla toda la logica propia de la reunion entre los middleware
//y los endpoint para cada ruta .En elllos se desarollan todas la funciones callbacks ,
//se triggerizan procesos , y se realiza todo lo referente al resultado final arrojado
//por la aplicacion

//==============================================================================================
//Al encontrarnos en el controlador correspondiente a todo lo referente con la collecion de
//user se hace necesario , importar la esquematizacion de dicha coleccion en la base de
//datos para entonces a partir de ella proceder con los diferentes procesos  del controlador,
//De ahi la trigerizacion de la variable User , la cal es incialiazada mediante la importacion
//del esquema de users del modulo de models
//=========================================================================================
var User = require("../models/user");

//===========================================================================================
//Como recurso extra se importa de express uno de sus items propios , el item respnse , que no seria
//mas que un helper para la escritura de syntax de codigos amedida que vayamos desarrolladndo
//los algoritmos
//=================================================================================================
const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

//=============================================================================================
//Por otra parte al encontrarnos en el proceso de user , se hace necesario la imprtacion de la
//libreria externa (bcryptjs), importandose y asignandose a la variable cryptoPaswword
const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via

//==================================================================================================
//Tambien al encontrarnos en el proceso  se hace necesario tambien generar un token cuando
//dicho usuario se logge correctamente , para ello es necesario importar del module de helpers, especificamnete
//de la carpeta jasonWebToken , la fucnion getJsonWebToken , a traves de la cual se importan y triggerizan librerias
//generadores de token necesarias en este proceso
//=======================================================================================================
const { getJsonWebToken } = require("../helpers/jasonWebToken");

////////////////////////////////////////////////////////////////////////////////////////
//////////////            INICIO DE LOS CONTROLADORES            ////////////////////////////

//========================================================================================
//Obteneindo todos los users en este apartado se incializa el proceso de la obtencion
//de todos los useres dentor de la coleccion de users, esto se le asigan previo a
//una variable la cual tendria por nombre getAllUsers, y mediante erl retorno de una funcion callbACK
//trigerizaria el proceso
//=====================================================================================
const getAllUsers = async (request, response, next) => {
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

  const from = Number(request.query.from) || 0; //basicamente se inicializa una constante en donde se especifica la paginacion
  //del query de la base de dtaos en este caso para el request de todos los usuarios .vease que se inicializa como nuemro
  //dado que el query se hace sobre un conteo de items en el api, de ahi que sea necesario que venga por el request
  //un numero no un string , y al tener en consideracion que lo que trae el reuest simepre es un json , se hace necesario
  //convertirlo a numero.De no mandarse ningun numero en el requset query from, entonces se procederia a mandar
  //un 0 para que no arroje Nan(ojo ....el from es una palabra que se pone a eleccion , pero tiene que coincidir con la
  //palabra que se ponga en el request del url)

  const [allUsers, allUsersLength] = await Promise.all([
    User.find({}, "name email role google img")
      .skip(from) //estableciendose a partir de que iterante se debe empezar a paginar
      .limit(5), //estableciciendose cuantos iterantes se deben paginar a partir del from

    User.countDocuments(), //contando el length de items en el arreglo de esquema USer
  ]);
  //vease que en este caso se realiza un a especie de multiporomesas que se ejecutan de manera simultanaia (Promise.all)
  //dentro de ellas entonces se inicializa un array de fuciones que devengarian un resultado , y entonces , y unicamente entonces
  //se pasaria a la sigueiente cuestion.Vease entonces que se incializa en la posicion 1 del array , el proceso que
  // traeria todos los users en la colleccion , ademas de establecerse el paginado,(skip).limit().Como segundo
  //elemento dentro de dicho array de funciones entonces se procederia a establecer un conteo sobre ese esquema de de
  //la colleccion de usuarios a traves del metodo de mongoose count().Ambas fucniones son asignadas a sus respectivas variables
  //desagregadas en el const [allUsers,allUsersLenght], en donde la primera variable seria asiganada a la posicion
  //1 dentro del array de fucniones , y la segund a a la posicion 2
  response.status(201).json({
    ok: true,
    allUsers,

    userToken: request.user,
    allUsersLength,
  });
}; //una vez pasado por este proceso de ser positivo entonces se arrojaria un response de
//satus 2200(ok) con un mesaje que indica que todos los users fueron obtenidos con su respectiva
//informacion , pasandose como data entoces el resultado del query anterior almacenado en la variable
//inicializada con el nombre de allUsers, ademas del deallUsersLength

//========================================================================================
//Creando el usuario  controller
//=====================================================================================
const createAUser = async (request, response, next) => {
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

  const { name, email, password } = request.body; //creandose un set de constantes que representarian
  //items del user model(email,name....), todo este
  //se le asigana el respnse que treria el body en el request

  const user = new User(request.body); //vease entonces que se declara una variable llamada user a la cual se le asigna
  //el valor de la inicializacion de un nuevo User (clase modelo del user)pasando
  //sele como parametro el request body previamente asignado a las constantes
  //email,name,y password

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    const existingEmail = await User.findOne({ email }); //antes de entrar en la logica se procede a determinar
    //si existe agun correo que iguale al que se pretende crear
    //junto con el usuario, para ello el criterio de busqueda a comparer se establece en el email desagregado
    //del request body previamente inicializado

    if (existingEmail) {
      return response.status(500).json({
        ok: false,
        msg: "Email Exists, cant proceed",
      });
    } //de no existir ningun email teniendo en cuenta el criterio de busqueda se procederia , a retornar una repsueta
    //de error y por consiguiente a finalizar el ciclo del proceso

    const salt = cryptoPaswword.genSaltSync();
    user.password = cryptoPaswword.hashSync(password, salt); //creandose una variable a la cual se le asigna como valor la
    //importacion del encriptador de contrasenas asi como una de sus dependencias genSaltSync(), para entonces luego acceder
    //a la variable user  de tipo User, y atraves de ella a una de sus items(password)...asignandosele  entonces el encriptado
    //(salt) como tal a ese parametro (password)

    await user.save(); //se salva la variable de tipo user con el esquema de User  en mongo

    const token = await getJsonWebToken(user.id); //en este paso de seguir el proceso , entonces se procederia
    //a generar el token, mediante la importacion de la variable getJsonWebToken proveniente del modulo helpers
    //especificamente de la carpeta jasonwebtoken, pasandosele como parametros la variable a la cual se le asigana
    //el esquema especico encontrado dentro de la collecioin de esquemas de Userasigando a la variable user,
    // y de ese esquema especifico se accede a su id para la construccion de dicho token , lo cual entonces
    //devengaria dicho token con lz infor macion del id uncamente.Este proceso se le asigna a una variable
    //constante llamada token

    await response.status(201).json({
      ok: true,
      user,
      token,
    });
    //para luego entonces proceder a dar un response positivo sobre dicho proceso
    //en donde a demas de mensaje de creacion y demas se procede tambien a exponer como data ewl token generado
    //y asignado a la variable token
  } catch (error) {
    //de lo contrario entonces en este catch se devolveria unu error
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  } //de no cumplirse el ciclo en el try entoces se procederia a entrar en el ciclo del
  //catch con su respectivo respnse de error  y su mensjae explicatico
};

//========================================================================================
//Modificar el usuario
//=====================================================================================
const updateUser = async (request, response = response) => {
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

  const userId = request.params.id; //designando el id traido por el usuario en el request de sus parametros oel URL

  try {
    //proceso de logica

    const userDb = await User.findById(userId); //estableciendo la constante que de cierta
    //manera le seria asignada el id necesario para determinar con posterioridad si el id
    //existente existe para ese User o no, para ello se accede al modleo esquematico de User
    //y a rtaves de el a l metodo findById(), pasandosele como paramtro la variable inicializada
    //anteriormente con el nombre de userId, la cual traeria como data el id pasado como params por
    //ell usuario en el url

    if (!userDb) {
      return response.status(400).json({
        ok: false,
        msg: "user doesn't exist",
      });
    } //pasando lo anterior entonces se procede a erogar una respuesta negativa en caso de que dicho
    //user con dicha id no existiese, arrojando un status 400 , y un mensaje de negacion

    const { password, google, email, ...userDbFields } = request.body;
    //trayendo todo lo que el usuario y sus items representa en el body del request, vease que en
    //desagregacion se omiten los elementos password, google, email, de ahi su inclusion

    if (userDb.email !== email) {
      //para evitar la modificacion de un correo a un correo ya existente o no actualizado
      //lo cual duplicaria los keys de ahi su elimnacion del cuerpo modificado asigando a

      const emailExisting = await User.findOne({ email }); //inicializando variable que trae el email existente en
      //el esquema del usuario, para posteriores validaciones

      if (emailExisting) {
        return response.status(400).json({
          ok: false,
          msg: "cant Update to this email cause already exists",
        });
      }
    } //en este caso de que el usuario pretenda modificar a un email que de hecho ya existe en la base de datos
    //entonces se retornaria un error del proceso y por ende la finalizacion del ciclo en este proceso

    userDbFields.email = await email; //de nos ser asi le inicializa un avarible llamada
    //userDbFields, y a la misma se le apendiza un item llamdo email , al cual se le asigan el valor
    //traido por el email del request body

    const userDbFieldsUpdated = await User.findByIdAndUpdate(
      userId,
      userDbFields,
      { new: true }
    );
    //Esta manera manera de modificacion es un poco mas sencilla y abarcadora pues pposterior al paso
    //anterior en donde se desagrega  el body request , simplemente ya se acederia entocens al constructor
    //de User para modifcar y a traves de la funcion findByIdAndUpdate, como bien se dice
    //primero se pasaria el id del usuario en cuestion  en cuestion traido median el request params(userId),
    //asignado a la variable userId, luegose pasarian los paremtros del update, los cuales se realizaron en el paso anterior , y por ultimo
    //(userDbFields)entonces se inicializaria el template new:true lo cual regresaria el ultimo documento actulaizaod.
    //Todo esto asignandose a la variable userDbFieldsUpdated

    await response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      userDbFieldsUpdated,
    }); //trayendo entonces la respuesta positiva ya con el hospital actualizado si el proceso anterior
    //es valido incluyendose dentro del response de su data el user actualizado(userDbFieldsUpdated)
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
//borrar  el usuario
//=====================================================================================
const deleteUser = async (request, response = response) => {
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

  const userId = request.params.id; //trayendo a traves del request param el id del usuario sobre el cual se
  //procedeara a inicializar el proceso de eliminacion teniendo en cuenta el id refeljado en el endpoint(/:id)

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    const userDb = await User.findById(userId); //estableciendo la constante que de cierta
    //manera le seria asignada el id necesario para determinar con posterioridad si el id
    //existente existe para ese user o no, para ello se accede al modelo esquematico de User
    //y a traves de el a l metodo findById(), pasandosele como paramtro la variable inicializada
    //anteriormente con el nombre de userId, la cual traeria como data el id pasado como params por
    //ell usuario en el url

    if (!userDb) {
      return await response.status(404).json({
        ok: false,
        msg: "user doesn't exist",
      });
    } //pasando lo anterior entonces se procede a erogar una respuesta negativa en caso de que dicho
    //user con dicha id no existiese, arrojando un status 400 , y un mensaje de negacion

    await User.findByIdAndDelete(userId);
    //De  o ser asi ,y si existir un user con el id pasado a traves del request, entonces se procederia
    //a acceder la colleccion esquematica de users(User), y de ella inicializar el metodo findByIdAndDelete
    //pasandole como parametro la variable previemnte incializada con el valor del id traido a traves del params

    response.status(201).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: true,
      msg: "User has been deleted",
    }); //Se procede a erogar una respuesta positiva de todo el proceso culminando conexito
    //dando como mensaje el borrado del usuaro y el status 200 d ela operacion
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    }); //de lo contrario se caeria en el ciclo catch en donde se erogaria el error , con su respectivo mensaje
    //y demas
  }
};

module.exports = {
  getAllUsers,
  createAUser,
  updateUser,
  deleteUser,
}; //Exportandose todos los controladores de este esquema(Doctor), para su posetrior uso en las demas dependencias
