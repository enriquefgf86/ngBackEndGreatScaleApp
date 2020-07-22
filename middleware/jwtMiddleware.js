
const jwt=require('jsonwebtoken');


const validateJwt = (request, response, next) => {
 
    const token = request.header("user-token");//leyendo el token que viene por el header asignadosle a la variable token
  console.log(token);
  
  if (!token) {//verificando si el token se manda o  no  
    return response.status(400).json({
      ok: false,
      msg: "no token in the request1",
    });
  }
  try {
      const {userId}=jwt.verify(token,process.env.TOKEN_SECRET_WORD);
      // console.log(userId);
      request.userId=userId

  } catch (error) {
    return response.status(400).json({
        ok: false,
        error,
        msg: "no token in the request",
      });
  }

  next();
};
module.exports = { validateJwt };
