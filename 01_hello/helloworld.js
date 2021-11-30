const express = require('express');
const {buildSchema} = require('graphql');
const {graphqlHTTP} = require('express-graphql');

//定义schema，定义查询和类型(查询方法)
const schema = buildSchema(`
    type Query {
        hello: String
    }
`);

//定义查询对应的处理器
const root = {
    hello: ()=>{
        return 'HelloWorld';
    }
}

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
    
}))
app.listen(3000);