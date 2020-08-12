//los elpers no serian mas que funciones que en su naturaleza serian de mucho uso de ahi que se
//se cree un archivo que las centraliza , importandose su nucleo para uso colectivo en demas dependiencias

//=============================================================================
//En el caso particular de esta aplicacion y en especifico de este helper se hace necesario
//importar los esquemas de collecciones  de User,Doctor , Y Hospital, para aceder a su contenido
//y demas desde el helper en si
//==============================================================================
const User = require("../models/user");
const Hospital = require("../models/hospitals");
const Doctor = require("../models/doctors");

//==========================================================================================
//Tambien se hace necesario traer una libreria externa llamada file sytem(fs) , que no seria
//mas que la encargada de mapera los archivos de sistema existente creando una Api, que posterior,emt
//pudiera ser accedeida por cualquier cuestion o uso
//===========================================================================================
const fs = require("fs"); //importando file sytem libreria de node para leer archivos del sistema

//=========================================================================================
//Inicializandose entonces el helper en si que se asiganria a la variable llamada updateImage
//==========================================================================================
const updateImage = async (typeFile, idFile, archiveStoredName) => {
  //vease que en el callback de la fucnion se pasan tres paramtros con los cuales se trabajrian en su
  //cuerpo, el tipo de elemento o coleccion(typeFile), el id de el item traido(idFile ), asi como
  //el nombre del archivo en si  archiveStoredName
  
  const deleteImages = (path) => {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path, (error) => {
        console.log(error);
      });
    } //de existir alguna imagen linkeada en el path uqe se pretende insertar esta nueva imagen entonces
    //la vieja se borraria a traves de los metodos de existSync y unlink de filesytem fs de nodes desarrollados
    //en esta funcion.Para ello se inicializa esta funcion de manera general para su  uso en el switch
  };

  switch (typeFile) {//a continuacion se inicializa el metodo switch en donde en donde el parametro
    //sa tener en cuenta para su ejecucion o break seria el tippo de coleccion(typeFile).bajo esta 
    //premisa se evaluan ciertas condiciones dentro de la coleleccion y demas 
    case "doctors":
      const doctor = await Doctor.findById(idFile);
      const oldImgPath = `./uploadFiles/doctors/${doctor.img}`;
      //vease uq epara el caso de estar en la colleccion de doctors(traido en el request en el controller)
      //lo primero que se hace es inicializar una variable llamada doctor , la cual mapearia el esquema
      //Doctor previamente importado, y a traves de ella se solicitaria encontrar un id especifico
      //traido mediante el parametro idDFile tambien expeuesto mediante request del controller en cuestion
      //y como segunda variable tambien se inicializa una llamada oldPath, que estableceria segun la colleccion
      //el rootfile especifico en donde dicha colleccion se encontraria , en donde su ultima 
      //parte haria referencia al al item img. del esquema Doctor especificamente de su modelo en el 
      //apartado img

      if (!doctor) {
        console.log("cant find doctor by that id");
        return false;
      } //verificando si el doctor buscado segun su id existe , de no ser asi la fucnion retorna false
      // y para su ciclo

      deleteImages(oldImgPath); //trigerizando la fucnion que elimina el archivo existente en el
      //directorio para reemplazarlo por el actual a subir esta fucnion fue la inicializada de maner a
      //general fuera del switch aunque en este caso ahora se le pasarisa el oldImgPath

      doctor.img = await archiveStoredName; //reasignandosel al apartado de la imagen del doctor una 
      //nueva imagen, la cual seria la traida como tercer parametro en el callback de la fucnion 
      //archiveStoredName
      await doctor.save(); //salvando los cambios en el proceso
      return true;
      break;

    case "users":
      const user = await User.findById(idFile);
      const oldImgPathUser = `./uploadFiles/users/${user.img}`;
      //vease uq epara el caso de estar en la colleccion de doctors(traido en el request en el controller)
      //lo primero que se hace es inicializar una variable llamada user , la cual mapearia el esquema
      //User previamente importado, y a traves de ella se solicitaria encontrar un id especifico
      //traido mediante el parametro idDFile tambien expeuesto mediante request del controller en cuestion
      //y como segunda variable tambien se inicializa una llamada oldPath, que estableceria segun la colleccion
      //el rootfile especifico en donde dicha colleccion se encontraria , en donde su ultima 
      //parte haria referencia al al item img. del esquema User especificamente de su modelo en el 
      //apartado img

      if (!user) {
        console.log("cant find user by that id");
        return false;
      } //verificando si el user buscado segun su id existe , de no ser asi la fucnion retorna false
      // y para su ciclo

      deleteImages(oldImgPathUser); //trigerizando la fucnion que elimina el archivo existente en el
      //directorio para reemplazarlo por el actual a subir

      user.img = await archiveStoredName; //reasignandosel al apartado de la imagen del user una nueva imagen
      await user.save(); //salvando los cambios en el proceso
      return true;
      break;

    case "hospitals"://mismo proceso que los dos anteriores pero en este caso para hospitals
      const hospital = await Hospital.findById(idFile);
      const oldImgPathHospital = `./uploadFiles/hospitals/${hospital.img}`;

      if (!hospital) {
        console.log("cant find hospital by that id");
        return false;
      } //verificando si el hospital buscado segun su id existe , de no ser asi la fucnion retorna false
      // y para su ciclo

      deleteImages(oldImgPathHospital); //trigerizando la fucnion que elimina el archivo existente en el
      //directorio para reemplazarlo por el actual a subir

      hospital.img = await archiveStoredName; //reasignandosel al apartado de la imagen del hospital una nueva imagen
      await hospital.save(); //salvando los cambios en el proceso
      return true;
      break;
  }
};
module.exports = {
  updateImage,
};//se export la fucnion  de este helper almacenada en la
//variable  updateimg para su uso en las demas dependencias de la aplicacion!!!
