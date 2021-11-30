const express = require('express');
const {buildSchema, graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt} = require('graphql');
const {graphqlHTTP} = require('express-graphql');

//第一步，定义类型
var AccountType = new GraphQLObjectType({
    name:"Account",
    fields:{
        name:{type: GraphQLString},
        age:{type:GraphQLInt},
        sex:{type:GraphQLString},
        department:{type:GraphQLString}
    }
})

//第二步，定义查询
var queryType = new GraphQLObjectType({
    name:"Query",
    fields:{
        account:{
            type:AccountType,
            args:{
                userName: {type:GraphQLString}
            },
            resolve: (_,{userName})=>{
                const name = userName;
                const sex='man';
                const age=18;
                const department='开发部';
                const salary = ({city})=>{
                    if(city==='北京'|| city ==='上海'|| city==='广州'||city==='深圳'){
                        return 10000;
                    }else{
                        return 3000;
                    }
                }
                return {
                    //属性是无序的
                    name,
                    sex,
                    age,
                    salary,
                    department
                    
                }
            }
        }
    }
})

//第三步，创建Schema
var schema = new GraphQLSchema({query: queryType});

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
    
}))
//公开文件夹，供用户访问静态资源
app.use(express.static('public'))
app.listen(3000);