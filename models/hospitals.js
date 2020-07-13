//==============================================================================
//Importando Mongoose para poder trabajar con el
//=============================================================================
var mongoose = require("mongoose"); //importando moongose
// var uniqueValidator = require("mongoose-unique-validator"); //pluin insertado para validaciones
var User = require("../models/user");
//==============================================================================
//llamando una de las fucnciones de moongose para la esquematizacion
//=============================================================================
var Schema = mongoose.Schema;

var validRoles = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} is not allowed",
};
//==============================================================================
//inicial;izando el formato o esquema que tendria este modelo de user siendo iden
//tico al inicializado en mongodb exceptuando el id generado por  mongo
//=============================================================================
var hospitalSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is Necesary"] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { collection: "hospitals" }
);

// hospitalSchema.plugin(uniqueValidator, { message: "the {PATH} must e unique" });
//==============================================================================
//Exportando el modulo recien creado , en donnde primero se especifica el nombre
//bajo el cual se exporta(USer), y el schema o modelo por el cual este
// modulo se rige para futuras collecciones de este tipo (userSchema)
//=============================================================================
module.exports = mongoose.model("Hospital", hospitalSchema);
