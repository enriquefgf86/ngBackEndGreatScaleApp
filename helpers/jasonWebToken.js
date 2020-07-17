const jsonWebToken = require("jsonwebtoken");


const getJsonWebToken=(userId)=>{

    return new Promise((resolve , reject)=>{

        const tokenPayload={userId,}

    jsonWebToken.sign(tokenPayload,process.env.TOKEN_SECRET_WORD,{
        expiresIn:'12h'
    },(error,generatedToken)=>{
        if(error){
            console.log(error);
            reject("cant generate token")
        }
        else{
            resolve(generatedToken)
        }
    });
    })
    
}
module.exports={getJsonWebToken,}