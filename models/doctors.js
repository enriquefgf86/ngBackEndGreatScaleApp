//==============================================================================
//Importando Mongoose para poder trabajar con el
//=============================================================================
// var mongoose = require("mongoose");//importando moongose
const { Schema, model } = require("mongoose"); //importando de monngose dos de sus funciones principales
//Schema para la modelizacion de cierto componente  y model
//para su exportacion
var uniqueValidator = require("mongoose-unique-validator"); //pluin insertado para validaciones

//==============================================================================
//llamando una de las fucnciones de moongose para la esquematizacion
//=============================================================================
// var Schema = mongoose.Schema;

var validRoles = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} is not allowed",
};
//==============================================================================
//inicial;izando el formato o esquema que tendria este modelo de user siendo iden
//tico al inicializado en mongodb exceptuando el id generado por  mongo
//=============================================================================
var doctorSchema = new Schema({
  name: { type: String, required: [true, "Name is Necesary"] },
  // email: { type: String, unique: true, required: [true, "Email is Necesary"] },
  // password: { type: String, required: [true, "Password is Necesary"] },
  img: { type: String, required: false },
  user: { type: Schema.Types.ObjectId,required: true, ref: "User" }, //haciendo referencia al la persona o esquema autorizado para crear un hospital
  //en este caso se hace referencia  a la clkase User,literlamente
  //indicadole a moongose la esxitencia de una relacion entre este modelo
  //esquema de hospitales y el esquema modelo de usuarios, proveniente
  //del userSchema

  hospital: { type: Schema.Types.ObjectId,required: true, ref: "Hospital" }, //haciendo referencia al la persona o esquema autorizado para crear un hospital
});

doctorSchema.plugin(uniqueValidator, { message: "the {PATH} must e unique" });

doctorSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
}); //modificando el esquema de usuario para cambiar algunos keys que por defecto mongo pone( __v y _id), poniendoles
//valores a conveniencia del usuario, en este caso el unico que se modifica es el _id designandosele como nuevo valor id
//los demas simplemente se omiten en la repsuesta del josn en cada request
//==============================================================================
//Exportando el modulo recien creado , en donnde primero se especifica el nombre
//bajo el cual se exporta(USer), y el schema o modelo por el cual este
// modulo se rige para futuras collecciones de este tipo (userSchema)
//=============================================================================
module.exports = model("Doctor", doctorSchema);
