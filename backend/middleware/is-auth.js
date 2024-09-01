const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../model/user');

const client = new OAuth2Client('591245236019-bi99a83ga45i3r98mvmtmhfgoiv22aah.apps.googleusercontent.com');

module.exports = {
    checIsAuth: async (req, res, next) => {
        const authHeader = req.get('Authorization');
        if (!authHeader || authHeader === '') {
            req.isAuth = false;
            return next();
        }
        console.log("token: ",authHeader);
        try {
            const decodedToken = await jwt.verify(authHeader, 'SECRETKEY');
            console.log("decodedToken : ", decodedToken);
            req.isAuth = decodedToken ? true : false;
            req.userId = decodedToken ? decodedToken.userId : null;
            return next();
        } catch (error) {
            req.isAuth = false
            return next();
        }
    },
    veriyAuthToken: async (req, res) => {
        const { idToken } = req.body;
        try {
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: '591245236019-bi99a83ga45i3r98mvmtmhfgoiv22aah.apps.googleusercontent.com',
            });
            const payload = ticket.getPayload();
            console.log("paylod : ",payload);
            const { email, name } = payload;

            let user = await User.findOne({ emailId: email });

            if (!user) {
                user = new User({
                    emailId: email,
                    name: name
                });
                await user.save();
                console.log("added!");
            }
            const token = jwt.sign({ userId: user.id, email: user.emailId }, 'SECRETKEY', { expiresIn: '1h' });
            res.json({ userId: user.id, token, tokenExpiration: 1 });

        } catch (error) {
            console.error('Error verifying Google token:', error);
            res.status(401).json({ message: 'Invalid token' });
        }
    }
}