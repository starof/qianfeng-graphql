const express = require('express');
const {buildSchema} = require('graphql');
const {graphqlHTTP} = require('express-graphql');

//定义schema，定义查询和类型(查询方法), mutation
const schema = buildSchema(`
    type Account{
        name: String,
        age: Int,
        sex: String,
        department: String
    }
    input AccountInput{
        name: String,
        age: Int,
        sex: String,
        department: String
    }
    type Mutation{
        createAccount(input:AccountInput):Account
        updateAccount(id:ID!, input:AccountInput):Account
    }
    type Query{
        accounts: [Account]
    }
`);

const fakeDb={};
//定义查询对应的处理器
const root = {
    createAccount: ({input})=>{
        //相当于数据库的保存
        fakeDb[input.name] = input;
        //返回保存结果
        return fakeDb[input.name];
    },
    updateAccount:({id,input})=>{
        const updatedAccount = Object.assign({},fakeDb[id],input);
        fakeDb[id] = updatedAccount;
        return fakeDb[id];
    },
    accounts:()=>{
        const accounts = [];
        for (const key in fakeDb) {
            if (Object.hasOwnProperty.call(fakeDb, key)) {
                const account = fakeDb[key];
                accounts.push(account)
            }
        }
        return accounts;
    }
    
}



const app = express();

// const middleware = (req, res, next)=>{
//     console.log(req);
//     if(!(req.url.includes("/graphql") && req.headers.cookie.includes("auth"))){
//         res.send(JSON.stringify({
//             error:"您没有权限访问这个接口"
//         }));
//         return;
//     }
//     next();
// }

const middleware = (req, res, next)=>{
    console.log("访问之前");
    
    console.log("请求的url",req?.url);
    console.log("请求的headers",req?.headers);
    console.log("请求的headers的cookie",req?.headers.cookie);
    if(req?.url?.indexOf("/graphql") !== -1 && (req.headers.cookie===undefined || req.headers.cookie?.indexOf("auth") === -1)){
        res.send(JSON.stringify({
            error: "您没有权限访问这个接口"
        }));
        return;
    }
    console.log("end---");
    next();
    console.log("next之后");

}
//注册中间件
app.use(middleware);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
    
}))
//公开文件夹，供用户访问静态资源
app.use(express.static('public'))
app.listen(3000);