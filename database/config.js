//=========================================================================================
//Haciendo necesario el uso de moongose para poder interactuar con la base de datos de mongo
//==========================================================================================
var mongoose = require("mongoose");
//=======================================================================
//conectando a la base de datos con ayuda de mongoose
//=======================================================================
const connection = async () => {
  try {
    await mongoose.connection.openUri(
    //   "mongodb+srv://Kikito3786:Kikito3786@cluster0.mfntc.mongodb.net/ngGreatScalesapp",//concexion de mongoose a la 
                                                                                           //base de datos
    
    process.env.DB_connection_chain,//opcional se pude hacer referencia a la variable de entorno DB_connection_chain
                                       // en donde tambien se declaro dicha cadena de conexion a la base de datos 
                                       //de ahi que se establezca dicho link a la variable de entorno   
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        //estos tres paramtros son nesearios para conectarse correctamente con mongo deb
      }
    );
    console.log("mongo database running:\x1b[32m%s\x1b[0m", "online");
  } catch (error) {
    console.log(error);
    throw new Error("Error initializing database .Please see logs");
  }
};
//===============================================================================================================
//Exportando este archivo de conexion a la base de detaos de mongoose en especifico exportandose la variable connection 
//a la cual le es asigando todo el path de conexion en si
//=================================================================================================================
module.exports={
    connection 
}

