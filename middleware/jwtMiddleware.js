//Esta carpeta de middleware seria la encargad ad establecer los procesos medios entre una accion
//y el termino de esta pasando por un proceso de verificacion para la autorizacion de su ejecucion
//que en este seria el middleware en si
//Este apartado seria el encargado de triggerizar el middleware de json web token para autentificaciones
//autorizaciones y demas para el usuario

//================================================================================
//como primer paso importante se hace necesario importar de la libreira de jsonwebtoken
//todas las dependencias necesarias para su uso , de ahi el require de la misma asignandosele
//dicho paquete a la variable jwt
//======================================================================================
const jwt = require("jsonwebtoken");

//===========================================================================================
//una vez importada dicha libreria entonces se procederia a lo que es el desarrollo del middleware
//que se utilizaria por los difderentes modlulos de la aplicaciona, y todo este proceso se le asiganria
//a la variable con nombre validateJwt
//============================================================================================
const validateJwt = (request, response, next) => {
  const token = request.header("user-token"); //en este apartado simpplemente  se inicializa una
  //variable con nombre  token , y se especifica que la misma tomaria el valor que vendria en el
  //request de la aplicacion, especificamente en el header de la misma , y por nombre o key
  //siempre debera usar el valor "user-token"(Esto es muy importante pues en el Postman o cualquier
  //otro tester de endpoiints es estrictamente necesario ponerlo de esa forma , en el header)

  console.log(request.header("user-token"), "header detail");
  if (!token) {
    return response.status(400).json({
      ok: false,
      msg: "no token in the request1",
    });
  } //este precodndicional no seria mas que la verificacion de que venga algo en el request ,
  //que en este caso no seria mas que la variable anteriormente reada llamada token .
  //De no venir esa variable , o presentar algun error en el speel de su key o cualquier
  //otro problema demarcaria un error

  //luego de haber pasado la primera verificacion , entonces se procederia a entrar
  //en el ciclo del try-catch, en donde primero se ejecutaria lo que se supone
  //seria el flujo de accion de la fucnion , y en el segundo paso , de no concretarse
  //el primero entonces se generaria un error que seria previamente atrapado en el catch
  try {
    const { userId } = jwt.verify(token, process.env.TOKEN_SECRET_WORD);

    request.userId = userId;
    console.log(request.userId);

    next(); //de no entrarse en el catch y la funcion seguir su curso normal entonces el middleware seria
    //efectivo y por consiguiente daria paso al proximo eslabon de la cadena mediante el metodo next()
  } catch (error) {
    //vease que primero se estable una constante llamada userId la cual no seria mas que el
    // resultado del proceso de verificacion de validez del token enviado a traves de
    //la libreria jsonwebtoken asignado previamente a la variable jwt, accediendose a traves
    //de ella al metodo verify() al cual se le pasarian como paramtros , el token traido en el
    //header del request , previamente asigando a la variable token , admeas de una palabara clave
    //solamente conocida por el creador de la aplicacion(yo), y que se almacenaria en el archivo
    //que recoge todas la variables de entorno, cuyo acceso sera a traves de process.env+nombre
    //del archivo almacenado .Un vez verificado y comprobado el token taido en ese
    //request se le puecde facilmente asiganr dicho resultado o valor al objeto traido en el request
    //asigandansole tambien como key el nombre de userId(request.userId)esto no seria mas que
    //un paso de extra confirmacion de la autenticidad del usuario y por ende acortaria un paso
    //pues ya en esta asigancion se treria el token y demas informacion para futuros
    //paso a acometer en la aplicacion

    return response.status(400).json({
      ok: false,
      error,
      msg: "no valid token ",
    });
  } //De no concretarse el primer paso de validacion y por consiguiente canalizacion
  //del token entonces se incureriria en un error que seria recogido en este apartado (cacth)
  //con su respectivo response y error code
};
module.exports = { validateJwt }; //exportandose la fucncion asignada a la variable validateJwt, para
//su futuro uso en las demas dependencias de la aplicacion.
