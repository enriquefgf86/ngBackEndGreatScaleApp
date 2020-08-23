//Este apartaddo seria el encargado de centralizar para su uso la fucncionde obtener
//un token para posterior uso de ntro de la aplicacion en procesos de confirmacion , auten
//tificacion , validaciones y demas


//========================================================================================
//Vease entonces que se hace necesario importar de la librearia externa jsonwebtoken su
//paquete mediante require , y dicha dependencia entonces es asignada a la variable
//jsonWebToken

//=====================================================================================
const jsonWebToken = require("jsonwebtoken");

//========================================================================================
//A continuacion se incializa el proceso de obtner el jsonttoek asignandosele dicho proceso
//a la variable getJsonWebToken
//========================================================================================
const getJsonWebToken = (userId) => {
  //Vease que se pasa un parametro en la fucnion callback
  //que hace referencia al userId generado en el middleware jwtMiddleware asignado al
  //request.userId

  //vease que esta fucnion se trata de manera general como un promesa la cual tendria
  //dos posibles resultados en su desempeno, resolve o reject segun su exito  o no
  //de ahi que desde su inicio se returne como new promise , pasandosele como callbakc
  //las dos posibles salidas (resolve , reject)
  return new Promise((resolve, reject) => {
    const tokenPayload = { userId }; //vease entonces que se inicializa un a variable llamda
    //tokenPaylod en donde se encerraria todo lo referente al contenido que trae
    //el parametro userId, previemente inicializado en el middleware jwtMiddleware (userId)

    jsonWebToken.sign(
      tokenPayload,
      process.env.TOKEN_SECRET_WORD,
      { expiresIn: "12h" },
      (error, generatedToken) => {
        if (error) {
          console.log(error);
          reject("cant generate token");
        } else {
          resolve(generatedToken);
        }
      }
    );
  });
  //por ultimo entonces se procederia a obtener el nuevo token mediante una serie de pasos que
  //se describen a continuacion:
  //-A traves de la importacion de la libreria jsonwebtoken asignada a la variable jsonWebToken
  //en el inicio, se accede a uno de su metodos (sign) el cual tendria como contenid varios parametros
  //-El primer paramtro seria como tal el userId traido en el request una vez pasado por el middelware
  //que en este caso no seria mas que la varibale tokenPayload a la cual se le asigana dicha data
  //proveniente del middleware mediante  la constante inicializada en ese modulo userId
  //-El segundo parametro a pasar seria la clave secrete alojada en las variables de environment
  //creada para autorizar la creacion de token , accediendose a ella a traves de proces.env+nombre
  //de la variable en cuetstion
  //-Como tercer parametro se pasaria el tiempo por el cual se quiere que dicho token muestr validez
  //para el usuario que lo crea, para ello se crea un objecto en donde el key seria expiresIn, y el
  //tiempor por el cual se pretende que sea valido dicho token se encierra en quotes('12h')
  //-Entonces como cuarto parametro se pasaria una fucnion callback en donde como parametros
  //tendria primero el error, y por segundo seria el token generado(generatedToken), siendo esto el
  //desenlace final de la funcion.
  //pare ello entonces como primer paso se establece una condicional en donde de existir el error
  //se llamaria como retorno el parametro reject de la promesa que es atoda esta fucnion en si
  //terminando el ciclo de la misma con un resultado no positvo, improimiendose mediante
  //console log el motivo de dichp error
  //o de lo contrario de no existir dicho error entoces se procederia a reslove de la miasma
  //fucnion pasandosele como parametro el generatedToken y por ende la renew del token por el
  //tiempo estipulado y demas
};



module.exports = { getJsonWebToken }; //se exporta la fucnion  de este helper almacenada en la
//variable  getJsonWebToken para su uso en las demas dependencias de la aplicacion!!!
