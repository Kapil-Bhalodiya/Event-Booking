const jwt = require('jsonwebtoken'); 

const checIsAuth = async (req,res,next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader || authHeader === ''){
        req.isAuth = false;
        return next();
    }
    console.log(authHeader);
    try {
        const decodedToken = await jwt.verify(authHeader, 'SECERTKEY');
        console.log("decodedToken : ",decodedToken);
        req.isAuth = decodedToken ? true : false;
        req.userId = decodedToken ? decodedToken.userId : null;
        return next();
    } catch (error) {
        req.isAuth = false
        return next();    
    }
}

module.exports = {checIsAuth};