//creandose la importacion de librerias para que funcionen ciertas dependencias ,
//se le llamara Requires
// ==============================================================================
// Requires
// ===============================================================================

var express=require('express');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');

//=======================================================================
//inicializando variables
//========================================================================
var app=express();
//=======================================================================
//Body parser para tratar automaticamente elementos json y codificados
//sin precisamente hardcodear
//====================================================================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
// ==================================================================
// importando la ruta creada asignadosele a una variable 
// ==================================================================
var loginRoutes=require('./routes/login')
var appRoutes=require('./routes/app');
var userRoutes=require('./routes/user')
//=======================================================================
//conectando a la base de datos
//=======================================================================
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDb',(error, response)=>{
if(error)throw error;
console.log("mongo database running:\x1b[32m%s\x1b[0m","online");

})
//=========================================================================
//estableciendo las rutas importadas desde los modulos 
//========================================================================
app.use('/user',userRoutes);

app.use('/login',loginRoutes);

app.use('/',appRoutes),//vease que en este caso se hace referencia a la importada desde el modulo routes
                      //haciendo referencia en este casoa la variable a la cual  le fue asifnada
                      //appRooutes, especificandose que la misma se triggerizaria si la ruta 
                      //seleccionada por el usuario es ('/')


//=======================================================================
//escuchando peticiones
//========================================================================
app.listen(3000,()=>{
    console.log("Express server running on port 3000:\x1b[32m%s\x1b[0m","online");
    
})
