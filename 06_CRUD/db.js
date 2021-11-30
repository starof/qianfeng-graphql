const express = require('express');
const {buildSchema} = require('graphql');
const {graphqlHTTP} = require('express-graphql');
const mysql = require('mysql');
// https://www.npmjs.com/package/mysql

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '123456',
  database        : 'alice'
});


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
        updateAccount(id:ID!, input:AccountInput):Account,
        deleteAccount(id:ID!):Boolean
    }
    type Query{
        accounts: [Account]
    }
`);




//定义查询对应的处理器
const root = {
    createAccount: ({input})=>{
        const data = {
            name: input.name,
            sex: input.sex,
            age: input.age,
            department: input.department
        }
        return new Promise((resolve, reject)=>{
            pool.query('insert into account set ?', data, (err)=>{
                if(err){
                    console.log("出错了",err);
                    return;
                }
                resolve(data);
            })
        }); 
    },
    updateAccount:({id,input})=>{
        const data = input;
        return new Promise((resolve, reject)=>{
            pool.query('update account set ? where name=?', [data,id], (err)=>{
                if(err){
                    console.log("出错了",err);
                    return;
                }
                resolve(data);
            })
        }); 
    },
    accounts:()=>{
        return new Promise((resolve, reject)=>{
            pool.query('select name, age, sex, department from account',(err, results)=>{
                if(err){
                    console.log("出错了",err);
                    return;
                }
                const arr = [];
                for(let i =0; i<results.length;i++){
                    arr.push({
                        name:results[i].name,
                        age:results[i].age,
                        sex:results[i].sex,
                        department:results[i].department
                    })
                }
                resolve(arr);
            })
        })
    },
    deleteAccount:({id})=>{
        return new Promise((resolve, reject)=>{
            console.log(id);
            pool.query('delete from account where name= ?',[id],(err)=>{
                if(err){
                    console.log("出错了",err);
                    reject(false);
                    return;
                }
                resolve(true);
            })
        });

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