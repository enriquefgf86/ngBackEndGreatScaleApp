const User = require("../models/user");
const Hospital = require("../models/hospitals");
const Doctor = require("../models/doctors");

const fs = require("fs"); //importando file sytem libreria de node para leer archivos del sistema

const updateImage = async (typeFile, idFile, archiveStoredName) => {
 
  const deleteImages = (path) => {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path, (error) => {
        console.log(error);
      });
    } //de existir alguna imagen linkeada en el path uqe se pretene insertar esta nueva imagen entonces
    //la vieja se borraria a traves de los metodos de existSync y unling de filesytem fs de nodes desarrollados
    //en esta funcion.Para ello se inicializa esrta funcion de manera general para uso en el switch
  };

  switch (typeFile) {
    case "doctors":
      const doctor = await Doctor.findById(idFile);
      const oldImgPath = `../uploadFiles/doctors/${doctor.img}`;

      if (!doctor) {
        console.log("cant find doctor by that id");
        return false;
      } //verificando si el doctor buscado segun su id existe , de no ser asi la fucnion retorna false
      // y para su ciclo

      deleteImages(oldImgPath); //trigerizando la fucnion que elimina el archivo existente en el
      //directorio para reemplazarlo por el actual a subir

      doctor.img = await archiveStoredName; //reasignandosel al apartado de la imagen del doctor una nueva imagen
      await doctor.save(); //salvando los cambios en el proceso
      return true;
      break;

    case "users":

        const user = await User.findById(idFile);
        const  oldImgPathUser = `../uploadFiles/users/${user.img}`;
  
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

    case "hospitals":
      const hospital = await Hospital.findById(idFile);
      const  oldImgPathHospital = `../uploadFiles/hospitals/${hospital.img}`;

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
};
