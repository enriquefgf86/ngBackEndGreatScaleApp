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
//inicial;izando el formato o esquema que tendria este modelo de hospital siendo iden
//tico al inicializado en mongodb exceptuando el id generado por  mongo
//=============================================================================
var hospitalSchema = new Schema({
  user:{type:Schema.Types.ObjectId,  ref:"User"}, 
  name: { type: String, required: [true, "Name is Necesary"] },
  img: { type: String, required: false },
  //haciendo referencia al la persona o esquema autorizado para crear un hospital
                                               //en este caso se hace referencia  a la clkase User,literlamente
                                               //indicadole a moongose la esxitencia de una relacion entre este modelo
                                               //esquema de hospitales y el esquema modelo de usuarios, proveniente
                                               //del userSchema
});

hospitalSchema.plugin(uniqueValidator, { message: "the {PATH} must e unique" });

hospitalSchema.method('toJSON',function(){
  const{__v,_id,...object}=this.toObject();
  object.id=_id;
  return object
})//modificando el esquema de hospital para cambiar algunos keys que por defecto mongo pone( __v y _id), poniendoles
//valores a conveniencia del usuario, en este caso el unico que se modifica es el _id designandosele como nuevo valor id
//los demas simplemente se omiten en la repsuesta del josn en cada request

//==============================================================================
//Exportando el modulo recien creado , en donnde primero se especifica el nombre
//bajo el cual se exporta(USer), y el schema o modelo por el cual este
// modulo se rige para futuras collecciones de este tipo (userSchema)
//=============================================================================
module.exports = model("Hospital", hospitalSchema);
