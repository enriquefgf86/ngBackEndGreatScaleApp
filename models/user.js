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
//(Admin,user).El nombre de la variable seria validRoles, y encasilla especificamente los valores
//que se deberian usar a la hora de asignar al usuario un role dentro del esquema y su estructura
//De aplicarse un roll distinto al que se demarca en el array de strings correspondiente a la
//al key values, entonces como mensdaje de error se trigerizaria el key correspondiente a
//message("{VALUE} is not allowed")
//=======================================================================================
var validRoles = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} is not allowed",
};

///==============================================================================
//inicializando el formato o esquema que tendria este modelo de User siendo iden
//tico al inicializado en mongodb exceptuando el id generado por  mongo, para ello se incializa
//una variable llamada userSchema  la cual le seria asignado la construccion
// de un nuevo objeto de tipo Schema previeamente importado de moongoose, en donde
//se le acotarian varios items
//=============================================================================
var userSchema = new Schema({
  name: { type: String, required: [true, "Name is Necesary"] }, //especificando uno de los items
  //necesarios en este esquema de user(name), especificandose que su tipo seria string
  //y seria requerido (true), en donde de no cumplirse dicho requerimiento , trigerizaria
  //un mensaje ("Name is Necesary")

  email: { type: String, unique: true, required: [true, "Email is Necesary"] }, //
  password: { type: String, required: [true, "Password is Necesary"] }, //lo mismo sucederia con email
  //y password

  img: { type: String, required: false }, //especificando otro de los items
  //necesarios en este esquema de doctor(img), especificandose que su tipo seria string
  //y no  seria requerido (false) su filling(opcional)

  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: validRoles,
  }, //a continuacion se inicialiaza otro de los items necesarios para el desarrollo
  //del esquema de user (role), que simepre sera requirido, sera de tipo string , y por default
  //tendria como valor uno de los roles previamente demarcados en el array de roles de la
  //variable valid Roles(User_role), como especie de watcher , entonces se inicializa uun key
  //llamado enum en el cual se le asigana como valor dicha variable validRoles, la cual actuaria como
  //vigilanete sobre el valor por default y su correcta seleccion , de lo contrario entonces trigerrizaria
  //el mensaje por error previamente inicializado en ella

  google: {
    type: Boolean,
    default: false,
  }, //Otro item necesario en este procese de conformacion del schema de user seria el de si dicho
  //usuario es usuario que se autentifica por ggole o no , para ello se inicializa otro key(google )
  //y se le asigna un objeto , en donde se especifica que seria de tipo booleano dicho item, ademas de
  //que por defeault su status seria false
});

userSchema.plugin(uniqueValidator, { message: "the {PATH} must e unique" });
//En este paso se aplica el uniqueValidator sobre el esquema de user , verificandose que
// no existan entries duplicados o demas errores por no originalidad del archivo que se
//pretende guardar, para ello se accede a lla variable previamente creada userSchema inicializada
//con un cosntrutor de Tipo Schema de moongose y a trave de ella al metodo plugin, en donde como
//primer paramtro se pasaria el plugin en si(uniqueValidator,), y como segundo parametro entonces
//se pasaria un objeto que encerraria un mesnaje en caso de que un error se suscitase

userSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
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
module.exports = model("User", userSchema);
