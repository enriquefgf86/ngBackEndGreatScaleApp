const { response } = require("express");
const {validationResult}=require("express-validator");//Se importa el los resultados del validador para saber o 
                                                      //poder leer una vez el middleware check del mismo paquete 
                                                      //haya hecho su trabajo , de donde es que el error originado
                                                      //provienne     

const fieldValidator = (response, request, next) => {
 
    const errors = validationResult(request); //asiganandosele a la variable llamada errors el retorno de errors
  // que pudiese traer la variable validationResult del paquete de
  //express-validator, pasandosle como [parametro el request]

  if (!errors.isEmpty()) {
   return  response.status(400).json({
      ok: false,
      errorType: errors.mapped(),
    });
  }
  else next();
};
module.exports={
    fieldValidator,
};
