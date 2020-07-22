var Doctor = require("../models/doctors");
var User = require("../models/user");
var Hospital = require("../models/hospitals");

const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

const { v4: uuidv4 } = require("uuid"); //genearador de nombres de archivos

const fs=require('fs')

const path=require('path')//obteniendo la libreria de path de nodes , necesaria [ara descifrar 
//path de archivos de sitemas en caso de que sea necesaria su descarga

const cryptoPaswword = require("bcryptjs"); //importando el encriptador de contrasenoa de una sola via
const { getJsonWebToken } = require("../helpers/jasonWebToken");
const {updateImage}=require('../helpers/updateImg')

const uploadFile = async (request, response = response, next) => {
  const typeFile = request.params.type;
  const idFile = request.params.id;

  const allowedTypes = ["hospitals", "users", "doctors"];

  if (!allowedTypes.includes(typeFile)) {
    return response.status(400).json({
      ok: true,
      msg: "file uploaded not valid(doctors,users,or hospitals) ",
    });
  }

  if (!request.files || Object.keys(request.files).length === 0) {
    //se valida la existencia de un archivo
    return response.status(400).json({
      ok: true,
      msg: "no file uploaded",
    });
  }
  const file = request.files.img; //obteneidnose la imagen en el request

  const nameFileCut = file.name.split("."); //reducuiendo el archivo retraido a solo su nombre siin incluir la extension

  const extensionFile = nameFileCut[nameFileCut.length - 1]; //obteniendo la extension del archivo en si ;

  const validExtensions = ["png", "jpg", "jpeg", "gif"];

  
  // Use the mv() method to place the file somewhere on your server
  

  if (!validExtensions.includes(extensionFile)) {
    //validadnod el extension valida
    return response.status(400).json({
      ok: true,
      msg: "not a valid extension must be png,jpg,jpeg,gif ",
    });
  }

  const archiveStoredName = `${uuidv4()}.${extensionFile}`; //esto es una libreria importada para generar nombres de archivos unicos.
  //vease que primero se importa dentro de backtick el generador ${uuidv4()} y
  //actoseguido se le ponen la extension d edich aimagen, asignado a la variable
  //extension file

  const archivePath = `./uploadFiles/${typeFile}/${archiveStoredName}`; //vease que en este caso simplemente se establece
  //tam bien mediante backtips el path en donde se almacenaria dicho archivo subido, para ello , primero se senaliza
  //el directorio en donde iria el mismo ./uppoads , luego tendiendo en cuenta el tipo de archivo(doctors ,users, hospitas)
  //dentro de ese directorio hay tres subidrecotrios a los cuales segun lo recibido por el paremtro type y asignado
  //a la variable fileType seria dirigido como segundo paso , y por ultimo entonces se haria referencia al archivo como
  //tal a almacenr en dicho directorio , previemnte determinado


  file.mv(archivePath, (err) => {
    if (err) {console.log(err);
      return response.status(400).json({
        
        ok: false,
        msg: "Error when trying to move image  ",
      });
    }

    updateImage(typeFile,idFile,archivePath,archiveStoredName);

    response.status(201).json({
      ok: true,
      msg: "file uploaded",
      archiveStoredName,
    }); 
  });//este profceso es copiado tal cual de la libreria de node fileupload-express, en el mismo simplemente 
  //se hace alusion al file traido en el request en caso de existir(file)y a traves de la funcion mv propia de
  //esta libreria se procede a pasar comomparametro primero el path asignado a dicho archivo segun el tipo
  //  que el usuario escogio y demas (esto previamente asigando a la constante archivePath), y entonces mediante 
  //funcion callback se procederia a determianr si dichpo proceso es exitoso o no 
  //que previamente determinaba el path en donde se d

 
};
const downloadFile=async (request ,response =response)=>{

  const typeUser=request.params.type;
  const imgFile=request.params.imagePath//inicializando los parametros necesarios que vendria 
  //por el request de la url para el inicio de la fucnion

  const pathImg= await path.join(__dirname,`../uploadFiles/${typeUser}/${imgFile}`);//vease entronces 
  //que se procede a conformar el path de donde se supone vendria la imagen almacenada , teniendo 
  //como parte de su string , los parametros prevismente inicializados mediante constantes 
  //typeUser, e imgFile

  

  if(fs.existsSync(pathImg)){
    await response.sendFile(pathImg);//una vez hecho todo el proceso anterior entonces sse procederia 
  //a obtener como respnse dicha referencia al path de la imagen requerida , y para ello se utiliza el 
  //metdod sendFile del response pasandole como parametro dicho path construido previamente, pero para e
  //ello primero es necesario verificar que el camino al cual se hace refernecia es el real hacia la 
  //imagen de ahi que se encierre en una condicional deicho proceso.
  }
  else {
    const imgDefault=path.join(__dirname,`../assets/no-img.jpg`);
    await response.sendFile(imgDefault)
  }//esto seria la repuesta a la inexistencia de la imagen segun el directorio seleccionado 
  //y por ende a manera de respuesta se procederia a redireccionar hacia otro path
  //en donde por defecto se encuatra una imagen de respaldo de default
}

module.exports = {
  uploadFile,downloadFile
};
