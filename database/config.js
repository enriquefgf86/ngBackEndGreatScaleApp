//En este apatado simplemente se inicaliza el proceso en el cual se estable la connecion
//con moongose y la base de datos de mongo , mediante la importacion de la libreir a
//propia de mongose, desarrollo de fucniones callback y demas

//=========================================================================================
//Haciendo necesario el uso de moongose para poder interactuar con la base de datos de mongo
//paa ello se imprta la libreia de mongoose y se asigana a un avariable d eigua nombre
//==========================================================================================
var mongoose = require("mongoose");

//=======================================================================
//En este proceso se esta conectando a la base de datos con ayuda de mongoose
// para ello dicho proceso es asignado a una variable constante llamada
// connection , y se encerraria en dose enlaces ;un try  el cual resumiria
//las operaciones a realizar durante el proceso , y un catch , el cual
//seria el encargado de atrapar cualquier problema originado
//=======================================================================
const connection = async () => {
  try {
    await mongoose.connection.openUri(
      //Vease que primero a traves de mongoose se accede a uno de
      //sus metodos 9connection, y a traves de el al metodo openUri el cual tendria como
      //parametro el link de conexion a la base de datos

      process.env.DB_connection_chain,
      //Opcion 1- se pude hacer referencia a la variable de entorno DB_connection_chain
      // en donde tambien se declaro dicha cadena de conexion a la base de datos
      //de ahi que se establezca dicho link a la variable de entorno

      //opcion 2 "mongodb+srv://Kikito3786:Kikito3786@cluster0.mfntc.mongodb.net/ngGreatScalesapp",
      //concexion de mongoose a laase de datos directamente sin utilizar la variable de netorno

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
      //Este segundo paramtro seria un objeto de tres items en si necesario para dicha connexion
      //y por defecto su configuracion es tal cual
    );
    console.log("mongo database running:\x1b[32m%s\x1b[0m", "online");
    //Este consoloe log es la constancia de nuestra conexion a la base de datos.Vease 
    //que en parte de su string se demarca \x1b[32m%s\x1b[0m , esto no seria mas que un 
    //estilo de color(verde) para la palabra que le sigue (online), a maner ade estetica
    //notrificandonos en en el cmd la conexion exitosa a la base de datos 
  } catch (error) {
    console.log(error);
    throw new Error("Error initializing database .Please see logs");
  }//en caso de que el try no fues exitose entrariamos en el ciclo del cacth para atrapar 
  //los errores suscitados , obteniednose un log de ,los mismos,
};
//===============================================================================================================
//Exportando este archivo de conexion a la base de datas de mongoose en especifico exportandose la variable connection
//a la cual le es asigando todo el path de conexion en si
//=================================================================================================================
module.exports = {
  connection,
};//se exportaporta la funcnion  de este helper almacenada en la
//variable  connection para su uso en las demas dependencias de la aplicacion!!!
