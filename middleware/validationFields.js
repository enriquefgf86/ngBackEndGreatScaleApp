//Esta carpeta de middleware seria la encargad ad establecer los procesos medios entre una accion
//y el termino de esta pasando por un proceso de verificacion para la autorizacion de su ejecucion 
//que en este seria el middleware en si 


//===========================================================================
//vease que se importa de express la variable response constante  , la cual nos ayudaria 
//con el syntax e importaciones a medida que vayamos escribiendo fucniones
//============================================================================
const { response } = require("express");
//=========================================================================================
//En este caso se inicializa un avariable de tipo constante  llamada validationResult,
//la cual importaria la libreria externa express-validator necesaria para validar campos y 
//demas necesarios en cualquier fucncion u otro middleware.Este paquete entre varias de sus dependencias 
//tiene al item check , necesario para verificar ciertas condiciones 
//========================================================================================
const {validationResult}=require("express-validator");  

//=====================================================================================================
//Inicio de la funcion callback la cual seria el helper middleware en si llamada en  fieldValidator
//la mismas inicializaria un callback con response , request , y un next que condicionaria la continuacion
//del proceso en caso de que fuese positivo 
//=======================================================================================================
const fieldValidator = (response, request, next) => {
 
    const errors = validationResult(request); //asiganandosele a la variable llamada errors el retorno de errors
  // que pudiese traer la variable validationResult del paquete de
  //express-validator,que no seria mas que un paquete de dependencias encargado de retornar un boleano
  //si se cumple o no una s de sus condiciones .El objeto sobre el cual se ejecutaria dicho 
  //libreria vendria en el request de ahi que se pase el mismo como parametr

  if (!errors.isEmpty()) {
   return  response.status(400).json({
      ok: false,
      errorType: errors.mapped(),
    });
  }//vease entonces que sobre el resultado de ;la variable inicializada anteriormente se 
  //establece una condicion , en donde simplemente se plantea que si dicha variable traida 
  //por la dependencia de express-validator no viene vacia (is.Empty())significa que algun error
  //detectado por dicho paquete viene dentro del request , y por ende no es valido de ahi la 
  //un resposne 400,  que demarca un error
  
  else next();//de no ser asi entonces como middleware al fin daria paso al siguiente proceso mediante
  //el metodo de next()
};
module.exports={//exportandose la fucnion antes inicializada en la variablefieldValidator,para  
    fieldValidator,//ser reusada en los difrentes modulos de la aplicacion
};
