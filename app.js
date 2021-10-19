
// example from https://graphql.org/graphql-js/running-an-express-graphql-server/
// https://graphql.org/graphql-js/graphql-clients/
// https://graphql.org/graphql-js/mutations-and-input-types/
// https://graphql.org/learn/schema/

var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors')
var path = require('path');

var todolist = [
    {todo: "Feed the cat", done: false},
    {todo: "Do the shopping", done: false},
    {todo: "Water the plants", done: false},
  ];  

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Item {
    todo: String
    done: String
  }

  input InputItem {
    todo: String
    done: String
  }

  type Query {
    list: [Item]
   
  }

  type Mutation {
    addtodo(input: InputItem): Item
    clearAll: [Item]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  list: () => {
    return todolist;
  },
  addtodo: ({input}) => {
    const {todo, done} = input;
    todolist.push({todo,done});
    return input;
  },
  clearAll: () => {
    todolist=[];
    return todolist ;
  }
};

var app = express();

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');