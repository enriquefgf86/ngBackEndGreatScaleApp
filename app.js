//creandose la importacion de librerias para que funcionen ciertas dependencias ,
//se le llamara Requires
// ==============================================================================
// Requires
// ===============================================================================

var express=require('express')
var mongoose=require('mongoose')
//=======================================================================
//inicializando variables
//========================================================================
var app=express();

//=======================================================================
//conectando a la base de datos
//=======================================================================
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDb',(error, response)=>{
if(error)throw error;
console.log("mongo database running:\x1b[32m%s\x1b[0m","online");

})
//estableciendo las rutas
//========================================================================
app.get('/',(request,response,next)=>{
    response.status(200).json({
        ok:true,
        message:'request correct'
    })
})



//=======================================================================
//escuchando peticiones
//========================================================================
app.listen(3000,()=>{
    console.log("Express server running on port 3000:\x1b[32m%s\x1b[0m","online");
    
})
