const express = require('express');
const {buildSchema} = require('graphql');
const {graphqlHTTP} = require('express-graphql');

//定义schema，定义查询和类型(查询方法)
const schema = buildSchema(`
    type Account{
        name:String
        age:Int
        sex:String
        department:String
        salary(city:String):Int
    }
    type Query {
        getClassMates(classNo: Int!): [String]
        account(userName:String):Account
    }
`);

//定义查询对应的处理器
const root = {
    getClassMates({classNo}){
        const obj={
            31:['张三','李四','王五'],
            61:['张大三','李大四','王大五']
        }
        return obj[classNo]
    },
    account({userName}){
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

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
    
}))
//公开文件夹，供用户访问静态资源
app.use(express.static('public'))
app.listen(3000);