//en este apartado se inicializan los procesos de carga y descarga de imagenes , utilizando librerias externas
//y propias de express para dicho proceso

//===========================================================================================
//Como recurso extra se importa de express uno de sus items propios , el item respnse , que no seria
//mas que un helper para la escritura de syntax de codigos amedida que vayamos desarrolladndo
//los algoritmos
//=================================================================================================
const { response } = require("express"); //importando response de express que basicamente seria una ayuda para saber
//posibles anotaciones necesarias que por ayuda dicho plugin trigerizan

//=========================================================================================================
//Importando libreria externa generadora de nombres para archivos
//===============================================================================================
const { v4: uuidv4 } = require("uuid"); //genearador de nombres de archivos

//=========================================================================================================
//Importando libreria externa necesaria para acceder a los directorios y archivos de sistemas , para
//deteccion de rutas , borrado soncronizacion y agregado d earchivos
//===============================================================================================
const fs = require("fs");

//=========================================================================================================
//obteniendo la libreria de path de nodes , necesaria [ara descifrar path de archivos de sitsemas
//en caso de que sea necesaria su descarga
//===============================================================================================
const path = require("path"); //obteniendo la libreria de path de nodes , necesaria [ara descifrar
//path de archivos de sitemas en caso de que sea necesaria su descarga

//==================================================================================
//importando helper updateImge pra la modificacion y actualizacion de imagenes
//====================================================================================
const { updateImage } = require("../helpers/updateImg");

////////////////////////////////////////////////////////////////////////////////////////
//////////////            INICIO DE LOS CONTROLADORES            ////////////////////////////

//====================================================================================
//Proceso de upload de imagenes
//==================================================================================
const uploadFile = async (request, response = response, next) => {
  //Vease que se trigeriza dicho callback con 3 paramtros , request,
  //lo cual seria el acarraeador de variables informacion y demas traida
  //l bodyt , o el header , o como params para el desarrollo de la aplicacion,
  //luego se establece el response , que npo seria mas que el parametro que acarrea en si las
  //diferentes respouestas que pudiesen suscitarse como resultado de una accion o desenlace
  //del metodo, y pdiesen traer respuestas validas o errores, segun la logica del proceso;
  //vease que este response se iguala o se le asigna el respnse traido de express
  //a manera de facilitrar la escritura del syntax; por ultimo , aunque mas usado
  //en los middelware vendria el parametro de next, lo cual daria continuidad a cualesquiera otro
  //proceso una vez terminado el proceso actual de manera satisfactoria

  const typeFile = request.params.type;
  const idFile = request.params.id; //Vease que se inicializan dos constantes en donde la primera (typeFile), le
  //  seria asigando el parametro traido mediante request por el usuario(/:type), correspondiente al tipo de colleccion
  //al cual se quiere subir la imagen(doctors, users, e emails), y como segundo constante (idFile), se le seria
  //asigando el paramtro traido mediante request por el usuario(/:id) correspondiente al id del usuario que hace el
  //upload en si (tengo que rectificar el nombre (idFile pues no hace alusion ))

  const allowedTypes = ["hospitals", "users", "doctors"]; //Luego se inicializa una variable llamado allowedTypes
  //a la la cual se le asignaria un array de strings que demarcarina los tipo de colleciones especificos
  //sobre los cuales pudiese ser posible que se alojara data , pues ya estan dichas carpetas con esos nombres previamnete
  //creadas en el directorio de la aplicacion , y cualquier otro nombre arrojaria un error

  if (!allowedTypes.includes(typeFile)) {
    return response.status(400).json({
      ok: true,
      msg: "file uploaded not valid(doctors,users,or hospitals) ",
    });
  } //En este proceso de verificacion se trata de comprobar si el array previamente inicializado mediante variable
  // allowedTypesincluye o coincide en alguno de los paramtros de su aarray con el paramtro traido mediante request y
  //asigando a la variable typeFile correspondiente a las collecciones aprobadas .De no ser asi se generaria un
  //error 400, y el ciclo proceso terminaria aqui

  if (!request.files || Object.keys(request.files).length === 0) {
    return response.status(400).json({
      ok: true,
      msg: "no file uploaded",
    });
  }
  //Pasado el primer verificador sew procede a determinar si dentro de ese request ahi alguna imagen
  //mediane el claculo del lenght del request.De no ser asi , se procederia a retornar una repsuesta
  //negativa y el ciclo d ela fucnion terminaria aqui

  const file = request.files.img; //obteneidnose la imagen en el request

  const nameFileCut = file.name.split("."); //reduciendo el archivo retraido a solo su nombre sin incluir la extension

  const extensionFile = nameFileCut[nameFileCut.length - 1]; //obteniendo la extension del archivo en si ;

  const validExtensions = ["png", "jpg", "jpeg", "gif"]; //Estabbleciendo un array de extensiones que podrianser
  //permitidsas para su upload

  if (!validExtensions.includes(extensionFile)) {
    return response.status(400).json({
      ok: true,
      msg: "not a valid extension must be png,jpg,jpeg,gif ",
    });
  } //Se establece otro verifcador que verifica si la extension del archivo que se pretende subir  coincide
  //con cualesquiera de las extensiones aprobadas seguun el array de string sde extensiones inicializado
  //en la variable  validExtensions, de no ser asi entonces se retornaria un status negativo y el ciclo
  //del proceso terminaria aqui

  const archiveStoredName = `${uuidv4()}.${extensionFile}`; //esto es una libreria importada para generar nombres de archivos unicos.
  //vease que primero se importa dentro de backtick el generador ${uuidv4()} y
  //actoseguido se le ponen la extension d edich aimagen, asignado a la variable
  //extension file

  const archivePath = `./uploadFiles/${typeFile}/${archiveStoredName}`; //vease que en este caso simplemente se establece
  //tambien mediante backtips el path en donde se almacenaria dicho archivo subido, para ello , primero se senaliza
  //el directorio en donde iria el mismo ./uppoads , luego tendiendo en cuenta el tipo de archivo(doctors ,users, hospitas)
  //dentro de ese directorio hay tres subidrecotrios a los cuales segun lo recibido por el paremtro type y asignado
  //a la variable fileType seria dirigido como segundo paso , y por ultimo entonces se haria referencia al archivo como
  //tal a almacenr en dicho directorio , previemnte determinado

  file.mv(archivePath, (err) => {
    if (err) {
      console.log(err);
      return response.status(400).json({
        ok: false,
        msg: "Error when trying to move image  ",
      });
    }

    updateImage(typeFile, idFile, archiveStoredName);

    response.status(201).json({
      ok: true,
      msg: "file uploaded",
      archiveStoredName,
    });
  }); //este profceso es copiado tal cual de la libreria de node fileupload-express, en el mismo simplemente
  //se hace alusion al file traido en el request en caso de existir(file)y a traves de la funcion mv propia de
  //esta libreria se procede a pasar como parametro primero el path asignado a dicho archivo segun el tipo
  //  que el usuario escogio y demas (esto previamente asigando a la constante archivePath),
  //luego haciendo alusion ala fucnion del helper updateImage encragada de modificar y actulizar directorios
  //de images y demas se le pasan los paramtros typeFile, idFile, archivePath, archiveStoredName, los cuales
  //segun proceso del helper cumplirian con su axometido, para luego de cumplimentarse el proceso correctamente
  //proceder a dar un response positivo y en el retrono de la data admeas de mostrar mensajes de exito y estatus
  //ok , se procederia entocnes a mostra el nuevo nombre de la imagen , o nueva imagen etc , proceso previmente
  //triggerizado en la variable archiveStoredName
};

//========================================================================================================
//Proceso de descargar archivos para su vista
//=====================================================================================================
const downloadFile = async (request, response = response) => {
  //Vease que se trigeriza dicho callback con 3 paramtros , request,
  //lo cual seria el acarraeador de variables informacion y demas traida
  //l bodyt , o el header , o como params para el desarrollo de la aplicacion,
  //luego se establece el response , que npo seria mas que el parametro que acarrea en si las
  //diferentes respouestas que pudiesen suscitarse como resultado de una accion o desenlace
  //del metodo, y pdiesen traer respuestas validas o errores, segun la logica del proceso;
  //vease que este response se iguala o se le asigna el respnse traido de express
  //a manera de facilitrar la escritura del syntax; por ultimo , aunque mas usado
  //en los middelware vendria el parametro de next, lo cual daria continuidad a cualesquiera otro
  //proceso una vez terminado el proceso actual de manera satisfactoria

  const typeUser = request.params.type;
  const imgFile = request.params.imagePath; //inicializando los parametros necesarios que vendria
  //por el request de la url para el inicio de la fucnion, en este caso para la constante typeUser,
  //haciendo referencia al type del request params correspndiente a :type, y para la constante
  //imgFile haciendo referencia al imagePath del request params correspndiente a :imagePath, y para la constante

  const pathImg = await path.join(
    __dirname,
    `../uploadFiles/${typeUser}/${imgFile}`
  ); //vease entonces que se procede a conformar el path de donde se supone vendria la imagen almacenada ,
  // teniendo como parte de su string , los parametros prevismente inicializados mediante constantes
  //typeUser, e imgFile

  if (fs.existsSync(pathImg)) {
    await response.sendFile(pathImg); //una vez hecho todo el proceso anterior entonces sse procederia
    //a obtener como respnse dicha referencia al path de la imagen requerida , y para ello se utiliza el
    //metdod sendFile del response pasandole como parametro dicho path construido previamente, pero para e
    //ello primero es necesario verificar que el camino al cual se hace refernecia es el real hacia la
    //imagen de ahi que se encierre en una condicional deicho proceso.
  } else {
    const imgDefault = path.join(__dirname, `../assets/no-img.jpg`);
    await response.sendFile(imgDefault);
  } //esto seria la repuesta a la inexistencia de la imagen segun el directorio seleccionado
  //y por ende a manera de respuesta se procederia a redireccionar hacia otro path
  //en donde por defecto se encuatra una imagen de respaldo de default
};

module.exports = {
  uploadFile,
  downloadFile,
};//Exportandose todos los controladores de este esquema(Doctor), para su posetrior uso en las demas dependencias

