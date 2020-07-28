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
// ===================================================================================
// Exportando la ruta o modulo para su uso en la aplicacion
// ==================================================================================
module.exports = app;
