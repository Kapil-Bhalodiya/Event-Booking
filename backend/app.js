const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphiqlSchema = require('./graphql/schema/index');
const graphiqlResolver = require('./graphql/resolver/index');
const { checIsAuth } = require('./middleware/is-auth');
const app = express();

app.use(bodyParser.json());
app.use(checIsAuth);
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
