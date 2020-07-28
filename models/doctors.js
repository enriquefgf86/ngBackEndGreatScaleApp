//Los modelos en este caso no serian mas que constructores para cada item de la collecion
//y la estructura que los mismo tendrian

//==============================================================================
//Importando de mongoose varia dependencias necesarias par poder trabajar
//con los modleos de collecion y sus diferentes estructuras
//=============================================================================
const { Schema, model } = require("mongoose"); //importando de monngose dos de sus funciones principales
//Schema para la modelizacion de cierto componente  y model
//para su exportacion

//============================================================================================
//Se hace necesaria tambien la importacion  de una libreria externa para mongoose
//llamada mongoose-unique-validator que no seria  mas que un plugin   que anade validacion
//unica a campos dentro de un Schema de moongose
//=======================================================================================
var uniqueValidator = require("mongoose-unique-validator"); //pluin insertado para validaciones


//========================================================================================
//inicializandose una variable a la cual se le asigan ciertos valores de strings 
//que en el caso particular de la aplicacion serian usados para otorgar rolos al usario
//(Admin,user)
//=======================================================================================
var validRoles = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} is not allowed",
};
//==============================================================================
//inicializando el formato o esquema que tendria este modelo Doctor siendo iden
//tico al inicializado en mongodb exceptuando el id generado por  mongo, para ello se incializa
//una variable llamada doctorSchema  la cual le seria asignado la construccion
// de un nuevo objeto de tipo Schema previeamente importado de moongoose, en donde
//se le acotarian varios items
//=============================================================================
var doctorSchema = new Schema({
  name: { type: String, required: [true, "Name is Necesary"] }, //especificando uno de los items
  //necesarios en este esquema de doctor(name), especificandose que su tipo seria string
  //y seria requerido (true), en donde de no cumplirse dicho requerimiento , trigerizaria
  //un mensaje ("Name is Necesary")

  img: { type: String, required: false }, //especificando otro de los items
  //necesarios en este esquema de doctor(img), especificandose que su tipo seria string
  //y no  seria requerido (false) su filling.

  user: { type: Schema.Types.ObjectId, required: true, ref: "User" }, //haciendo referencia al
  //la persona o esquema autorizado para crear un doctor
  //en este caso se hace referencia  a la clase User,literlamente
  //indicadole a moongose la esxitencia de una relacion entre este modelo
  //esquema de hospitales y el esquema modelo de usuarios, proveniente
  //del userSchema, para ello se especifica  que el tippo de user correspondaeria al tipo
  //objectId de los items representados en la dependencia de Schema de mongosse en este caso el
  //esque ma de USer(type: Schema.Types.ObjectId), tambien refiere que se hace necesario
  //saber quien crea el doctro de ahi que el required sea true, y por ultimo se hace referencia
  //a la colleccion esquematica de donde se sacaria ese objectId  autorizado para crear el
  //doctor , en este caso el eque ma de User(ref: "User")

  hospital: { type: Schema.Types.ObjectId, required: true, ref: "Hospital" },
  // parecido al proceso anterior pero en este caso con Hospita Schema
});

doctorSchema.plugin(uniqueValidator, { message: "the {PATH} must e unique" });
//En este paso se aplica el uniqueValidator sobre el esquema de doctor , verificandose que 
// no existan entries duplicados o demas errores por no originalidad del archivo que se 
 //pretende guardar, para ello se accede a lla variable previamente creada doctorSchema inicializada
 //con un cosntrutor de Tipo Schema de moongose y a trave de ella al metodo plugin, en donde como 
 //primer paramtro se pasaria el plugin en si(uniqueValidator,), y como segundo parametro entonces
 //se pasaria un objeto que encerraria un mesnaje en caso de que un error se suscitase 

doctorSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
}); //modificando el esquema de usuario para cambiar algunos keys que por defecto mongo pone( __v y _id), poniendoles
//valores a conveniencia del usuario, en este caso el unico que se modifica es el _id designandosele como nuevo valor id
//los demas simplemente se omiten en la repsuesta del josn en cada request

//==============================================================================
//Exportando el modulo recien creado , en donnde primero se especifica el nombre
//bajo el cual se exporta(Doctor), y el schema o modelo por el cual este
// modulo se rige para futuras collecciones de este tipo (doctorSchema)
//=============================================================================
module.exports = model("Doctor", doctorSchema);
