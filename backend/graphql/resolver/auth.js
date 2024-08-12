const bcrypt = require('bcryptjs')
const User = require('../../model/user');
const jwt = require('jsonwebtoken');

module.exports = {
   createUser: (userArgs) => {
        return User.findOne({ emailId: userArgs.userInput.emailId }).then(user => {
            if (user) {
                throw new Error("User Already Exist")
            }
            return bcrypt.hash(userArgs.userInput.password, 12);
        })
            .then(hashedPassword => {
                const user = new User({
                    emailId: userArgs.userInput.emailId,
                    password: hashedPassword
                })
                user.save()
                return user;
            }).catch(err => {
                throw err;
            })
    },
    login: async ({emailId, password}) => {
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid User");
        }
        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass){
            throw new Error("Invalid Credential");
        }
        const token = jwt.sign({ userId : user.id, email: user.emailId},'SECERTKEY', {expiresIn: '1h'});
        return { userId: user.id, token: token, tokenExpiration: 1 }
    }
}