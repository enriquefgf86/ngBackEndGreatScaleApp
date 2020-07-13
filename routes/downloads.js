//=================================================================
//Esta seria la ruta principal de la cual se deslindan las demas
//previamente estaba en el archivo app.js, pero a manera de modularizar y segmentar
// todo se procede a crearla en un fiel separado llamdo routes en este archivo
// llamdo app.js
//======================================================================

// =======================================================================
// Al igual que en el root app es necesario importar express node para establecer
// la fucnionalidad del backend de node
// =======================================================================
var express = require("express");
//=======================================================================
//inicializando variables express
//========================================================================
var app = express();

const path=require("path");
const fileSystem=require("fs")
// ===========================================================================
// Estableciendo la ruta principal
// ===========================================================================
app.get("/:collectionType/:imageName", (request, response, next) => {

    var imgName=request.params.imageName;
    var type=request.params.collectionType;

    var pathImg=path.resolve(__dirname,`../uploadFiles/${type}/${imgName}`)//estableciendose el path para encontrar la imagen

     if(fileSystem.existsSync(pathImg)){
         response.sendFile(pathImg)
     }
     else{
        var pathNotFoundImage=path.resolve(__dirname,'../assets/no-img.jpg');
        response.sendFile(pathNotFoundImage)
     }

  
});
// ===================================================================================
// Exportando la ruta o modulo para su uso en la aplicacion
// ==================================================================================
module.exports = app;
