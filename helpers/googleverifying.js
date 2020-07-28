//Este aprtado es exclusivamente para el desarrollo de todo el proceso referente
//al Google sign in del usuario de ahi que se haga necesario importar librerias
//y demas propias de dicho proceso

//=======================================================================================
//primero se hace necesario importar la libreria de authentificacion de google (google-auth-library)
//y de ella especificamente una de sus items OAuth2Client(este elemento si es propio de dicha libreria
//NOOO es un nombre puesto al azar)
//=============================================================================================
const { OAuth2Client } = require("google-auth-library");

//============================================================================================
//Luego se procederia a inicializar un avariable llamada client, a la cual se le asignaria
//todo lo referente a la creacion de un neuvo constructor de tipo OAuth2Client previamente
//traido con la libreria , al cual se le pasaria como parametro el valor que tiene una
//variable de entorno GOOGLE_ID_CLIENT_PUBLIC_IDENTIFIER la cual fue obtenido del google
//developer console para el inicio de este proceso(como un apikey)
//==========================================================================================
const client = new OAuth2Client(process.env.GOOGLE_ID_CLIENT_PUBLIC_IDENTIFIER);

const googleVerifyToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_ID_CLIENT_PUBLIC_IDENTIFIER, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];

  console.log(payload);
  const { name, email, picture } = payload;
  return { name, email, picture };
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}; //todo este proceso es propio de google y fue copiado tal cual

module.exports = {
  googleVerifyToken,
}; //se exporta la fucnion  de este helper almacenada en la
//variable  googleVerifyToken para su uso en las demas dependencias de la aplicacion!!!