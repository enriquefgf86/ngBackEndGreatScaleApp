//==============================================================================
//Importando Mongoose para poder trabajar con el
//=============================================================================
var mongoose = require("mongoose");//importando moongose
var uniqueValidator=require('mongoose-unique-validator')//pluin insertado para validaciones
//==============================================================================
//llamando una de las fucnciones de moongose para la esquematizacion
//=============================================================================
var Schema = mongoose.Schema;

var validRoles={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} is not allowed'
}
//==============================================================================
//inicial;izando el formato o esquema que tendria este modelo de user siendo iden
//tico al inicializado en mongodb exceptuando el id generado por  mongo
//=============================================================================
var userSchema = new Schema({
  name: { type: String, required: [true, "Name is Necesary"] },
  email: { type: String, unique: true, required: [true, "Email is Necesary"] },
  password: { type: String, required: [true, "Password is Necesary"] },
  img: { type: String, required: false },
  role: { type: String, required: true, default: "USER_ROLE",enum:validRoles },
});

userSchema.plugin(uniqueValidator,{message:'the {PATH} must e unique'})
//==============================================================================
//Exportando el modulo recien creado , en donnde primero se especifica el nombre
//bajo el cual se exporta(USer), y el schema o modelo por el cual este 
// modulo se rige para futuras collecciones de este tipo (userSchema)
//=============================================================================
module.exports=mongoose.model('User',userSchema);
