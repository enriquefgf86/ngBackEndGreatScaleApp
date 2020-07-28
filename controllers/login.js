//En este apartado se procede a desarrollar toda la logica correspondiente al proceso de logeado
//por el usuario tanto de manera convencional como por google, para ello se ahce necesario
//importar el esquema de User asi como otras librerias de verificacion , encripatdo y demas
//necesarias para dicho proceso

//===========================================================================================
//Como recurso extra se importa de express uno de sus items propios , el item respnse , que no seria
//mas que un helper para la escritura de syntax de codigos amedida que vayamos desarrolladndo
//los algoritmos
//=================================================================================================
const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

//==============================================================================================
//Al encontrarnos en el controlador correspondiente a todo lo referente al loggeado de usuarios
//entonces se hace necesario , importar la esquematizacion de dicha coleccion en la base de
//datos para entonces a partir de ella proceder con los diferentes procesos  del controlador,
//De ahi la trigerizacion de la variable User , la cal es incialiazada mediante la importacion
//del esquema de users del modulo de models
//=========================================================================================
const User = require("../models/user");

//=============================================================================================
//Por otra parte al encontrarnos en el proceso de login , se hace necesario generar un password
//para el usuario loggeado , y por ello tambien es necesario , encryptar dicho password como
//motivos de seguridad, de ahi la imprtacion de la libreria externa (bcryptjs), importandose
//y asignandose a la variable cryptoPaswword
const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via

//==================================================================================================
//Tambien al encontrarnos en el proceso de loggeado se hace necesario tambien generar un token cuando
//dicho usuario se logge correctamente , para ello es necesario importar del module de helpers, especificamnete
//de la carpeta jasonWebToken , la fucnion getJsonWebToken , a traves de la cual se importan y triggerizan librerias
//generadores de token necesarias en este proceso
//=======================================================================================================
const { getJsonWebToken } = require("../helpers/jasonWebToken");

//===========================================================================================================
//como modo de login alternativo tambien se introduce el google sign in , de ahi que tam biien se haga necesario
//verificar mediante token la veracidad del usuario loggeado con esta modlaida, so para ello y tambien ayudados
// de librerias externas tambien se importa del la carpeta de helpers la funcion asiganda a la variable googleVerifyToken
//la cual traeria consigio genradores de token de google y demas necesarios para de conjunto con los genradores de
//token locales validarla accion del usuario y proceder a su logeo
//======================================================================================================
const { googleVerifyToken } = require("../helpers/googleverifying"); //importando el helper necesario para
//la confirmacion de token emitido por google

////////////////////////////////////////////////////////////////////////////////////////
//////////////            INICIO DE LOS CONTROLADORES            ////////////////////////////

//========================================================================================
//Login convencional del usuario
//=====================================================================================
const loginUser = async (request, response = response) => {
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

  const { email, password } = request.body; //vease que en este caso en el body de dicho proceso de tipo
  //post se hace necesario pasar ciertos elementos que serian los necesarios para loggear el usuario;
  //dichos elementos serian email y pasword, para ello entonces vease que se inicializan desagregadas
  //dos constantes (email, password ), que corresponderian entonces a eso dos elementos que se supone el body
  //traeria

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    const userDb = await User.findOne({ email }); //como primer paso en este try , se procede a inicializar
    //una variable a la cual se le asigna por nombre userDb, la cual entonces procederia a
    //acceder el modelo esquematico asigando a la variable User y a traves de ella al metodo de findOne,
    //especificanod que el criterio a tener en cuenta para encontrar dicho usuario seria el email, el cual seria
    //el correspondiente a uno de loas consatantes desagregadas del request.body, no se hace por el pasword
    //o por alguna otra item  porque se suppone el unico paremtro queriable para busqueda en este especifico
    //proceso seria el email

    if (!userDb) {
      return response.status(400).json({
        ok: false,
        msg: "Email  not valid",
      });
    } //Estableciendose una condsicional que determina si el email por el cual se hace el query sobre la collecion
    //de User , existe(se ha registrado anteriormnete), de no ser asi se supone el usuario no se ha registradi
    //y por tanto no tien autorizacion para loggear

    const validPassword = await cryptoPaswword.compareSync(
      password,
      userDb.password
    ); // en caso de que el email existiese, entonces en este paso se procederia a comparar la contrasena
    //traida en el body previamete tecleada por el usuario con la contrasena guardadsa en la base de datos una vez
    //ese usuario se registro. Para ello entonces se inicializa una variable llamada validPassword , asigandosele
    //dicho proceso , el cual consiistiria en acceder a la variable a la cual se le asigno la libreria de encri
    //patcion de passwords(bcryptjs)llamada cryptoPaswword , y a traves de ella al metodo de dicha libreria
    //llamdo compareSync, el cual tendria como pparametros a comparar entre si , primero la contrasena traida en el
    //body request asignada a la variable password, y esto comparado con la contrasena alojada en la base de datos para
    //dicho usuario registrado , para ello se accede a traves de la variable userDb , previamente inicializada compo
    //representativa de dicho esquema User, y a traves de ella accedeiendose a uno de sus items segun el modelo
    //(password)

    if (!validPassword) {
      //checking if password is fine
      return response.status(400).json({
        ok: false,
        msg: " password  not valid",
      });
    } //de no ser exitoso el proceso de comparacion alojado en la variable validPassword, se procederia
    //a arrojar una respuesta negativa y el ciclo terminaria aqui

    const token = await getJsonWebToken(userDb.id); //en este paso de seguir el proceso , entonces se procederia
    //a generar el token, mediante la importacion de la variable getJsonWebToken proveniente del modulo helpers
    //especificamente de la carpeta jasonwebtoken, pasandosele como parametros la variable a la cual se le asigana
    //el esquema especico encontrado dentro de la collecioin de esquemas de User, y de ese esquema especifico
    //se accede a su id para la construccion de dicho token , lo cual entonces devengaria dicho token con lz infor
    //macion del id uncamente.Este proceso se le asigna a una variable constante llamada token

    response.status(201).json({
      ok: true,
      msg: "Ok logged",
      token,
    });
    //para luego entonces proceder a dar un response positivo sobre dicho proceso
    //en donde a demas de mensaje de creacion y demas se procede tambien a exponer como data ewl token generado
    //y asignado a la variable token
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      msg: "Unexpected error .Check logs",
    });
  } //de no cumplirse el ciclo en el try entoces se procederia a entrar en el ciclo del
  //catch con su respectivo respnse de error  y su mensjae explicatico
};

//======================================================================================================
//Proceso de loggeado con Google
//===================================================================================================
const loginUserGoogle = async (request, response = response) => {
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

  const googleToken = request.body.token; //vease que en este paso se le asigana a la variable
  //googleToken, el token que vendria en el request.body, el cual contendria informacion necesaria
  //tales como datos del usuario y demas , importantes para proximos procesos

  //luego se procede a inicializarse el proceso de try catch, en donde en su primera parte se
  //se procederia a ejecutar lo que se supone sea lo que la fucnion de bve arrojar como resultado y
  //que de no ser asi seria arrojado entoinces a la segunda parte del proceso(catch), con el log
  //de sus respectivos errores y demas
  try {
    const { name, email, picture } = await googleVerifyToken(googleToken); //all aplicar la funcion
    //helper de googleVerifyToken, a la misma es necesario pasarle un parametro  que endria e el
    //requestbody del usuario.Por default dicho token propiciado por google traeria muchos items
    //entre ellos 3 constantes que serian de mucha importancia en nuestro proceso, de ahi que en vez de
    //traer todo el token en general , se procederia a desagregarlo en varias de los items
    //contantes que el mismo tiene{name,email,picture}, y trabajar directamente con esos elementos.
    //Este proceso seria fundamental , pues a traves de estos facores se determina el usuario que viene
    //linkenado la data con la data de nuestor server , y procediendo a generar un token propio
    //para la validacion de dicho usuario

    const userDb = await User.findOne({ email }); //una vez desagregado dicha variable googleVerifyToken
    //en varia de las constantes que la misma trae previamente calculadas en el helper , se procederia entonces
    //a traves del esquema de User, y uno de sus metodos(findOne)a establecer un query que compare los exitentes en la
    //collecion con el usuario y la dat del mismo que pretende loggear mediant egoogle , para ello vease que se
    //utiliza el criterio de email traido por ese usuario de google , para saber si dicho email con que el loggea
    //en google existe en nuesto server y por ende establecer conexxion de ahi que se pase como parametro
    //dicha email traido desde googleVerifyToken.Vease que se escoge el email y no el nombre , pues el proceso de
    //login en esta aplicacion en especifico es a traves d eemail y paswword.
    //Todo este proceso le es asignado a la =variable userDb

    let user; //se crea una variable llamada user para su uso pposterior

    if (!userDb) {
      user = new User({
        name: name,
        img: picture,
        email: email,
        password: "ddfgfgfggg",
        google: true,
      });
    } else {
      user = userDb;
      user.google = true;
    }
    //Vease que en este proceso simplemnet se procede a loggear el usuario en si mediante procesos
    //alternativos en donde el primero de no existir dicho usuario  en nuestro back, simplemente , s eprocederia
    //a crear un nuevo esquema de user en nustra base dedtaos , pasandole los parametros que trae por defecto
    //el googleVerifyToken(name, email,picture), asigando a los items que el modelo de User en si tiene
    //defecto inicializados como keys en este new User object name, img e email.En el caso del password,
    //propio del esquma de User , no es necesari especificar pasword alguna pues ya viene con el usuario
    //desde google , y cada vez que el se loggee Google se encargar de estionar dicho proceso.
    //Por otra parte  el aprtado de googletoken  se define como true tambien .
    //En el caso contrario (else), simplemente a la variable user se le asignaria ese usuario (UserDb) encontrado
    //segun el criterio de email con toda su data , y a traves del mismo se accederia al apratdo de google
    //y tambien se estableceria como true

    await user.save(); //posterior a este proceso se procede a slavar dicha variable user a la cual le fueron asigandos
    //cualesquiera de los procesos alternativos en el back server mediante la funcion save()

    const token = await getJsonWebToken(user.id); //en este paso de seguir el proceso , entonces se procederia
    //a generar el token, mediante la importacion de la variable getJsonWebToken proveniente del modulo helpers
    //especificamente de la carpeta jasonwebtoken, pasandosele como parametros la variable a la cual se le asigana
    //el esquema especico encontrado dentro de la collecioin de esquemas de User, y de ese esquema especifico
    //se accede a su id para la construccion de dicho token , lo cual entonces devengaria dicho token con lz infor
    //macion del id uncamente.Este proceso se le asigna a una variable constante llamada token

    response.status(201).json({
      ok: true,
      msg: "Ok Google logged",
      name,
      email,
      picture,
      token,
    }); //si la respuesta es positiva y el token suministrado es correcto , entonces se procederia
    //adar uun mensaje en donde se exlica el ok de la respuesta asi como el despliegue de todas las
    //constantes previamente desagregadas del token(email,name ,picture) propias por default de dicho
    //token emitido por google
  } catch (error) {
    return response.status(400).json({
      //se devuelve un esstado positivo sobre la modificacion del usuario del usuario
      ok: false,
      msg: "Token isnt correct",
    });
  } //de no cumplirse el ciclo en el try entoces se procederia a entrar en el ciclo del
  //catch con su respectivo respnse de error  y su mensjae explicatico
};

//==========================================================================================================
//Renovando token para usuario loggeado
//=========================================================================================================
const loginUserTokenRenew = async (request, response = response) => {
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

  const userId = request.userId; //Vease que a continuacion se crea una contante
  // encargada de recopilar todla la informacion traida en le request
  //especificamente en el apartado userId, asigandosele dicha data a una constante de igual nombre
  // en donde dicho requeste especificamente el parametro userid que vendria asigando de antemano
  //con un token valido , previamente calculado en  el middleware jwtMiddleware calculado en dicho modulo.

  const renewToken = await getJsonWebToken(userId); //en este paso de seguir el proceso , entonces se procederia
  //a generar el token, mediante la importacion de la variable getJsonWebToken proveniente del modulo helpers
  //especificamente de la carpeta jasonwebtoken, pasandosele como parametros la variable userId, la cual ya de antemano
  //trai infoomacion previa correspndiente al usuarioo registrado aunque ya a punto de expirar, de ahi que sea ella misma
  //la que se pasa como parametro, lo cual entonces devengaria dicho token con lz infor
  //macion del id uncamente.Este proceso se le asigna a una variable constante llamada renewToken

  response.status(201).json({
    ok: true,
    msg: "token Generated",
    renewToken,
  });
}; //basicamente en este ultimo metodo simplemente se regresaria un nuevo token , cuando
//el actual se encuentre a punto de vencer

module.exports = { loginUser, loginUserGoogle, loginUserTokenRenew };
//Exportandose todos los controladores de este esquema(Doctor), para su posetrior uso en las demas dependencias
