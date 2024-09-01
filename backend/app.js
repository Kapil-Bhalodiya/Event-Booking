const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { graphqlUploadExpress } = require('graphql-upload');

const graphiqlSchema = require('./graphql/schema/index');
const graphiqlResolver = require('./graphql/resolver/index');
const { checIsAuth, veriyAuthToken } = require('./middleware/is-auth');
const cors = require('cors');
const app = express();



app.use(cors());
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
app.use(bodyParser.json());
app.use(checIsAuth);
app.post('/auth/google/token', veriyAuthToken);

app.use('/graphql',
    graphqlHTTP({
        schema: graphiqlSchema,
        rootValue: graphiqlResolver,
        graphiql: true
    })
)

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.lzfp5mu.mongodb.net/${process.env.MONGODB_SCHEMA}`).
    then(() => {
        console.log("Connected..")
        app.listen(3001);
    }).
    catch((err) => {
        console.log("connection Error : ", err)
    })
