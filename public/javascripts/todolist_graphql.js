console.log("in script");

// class to represent todo items
class ToDoItem {
    constructor(todo, done){
        this.todo = todo;
        this.done = done;
    }
}

async function gettodos()
{
    // make asynchronous call to API and return response as JSON once completed
    let response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query: "{ list{todo} }"})
      })
    let content = await response.json();
    return content;
}

async function showlist(content)
{
     // get DOM element for list and clear its contents
    const todolist = document.getElementById("todolist");
    todolist.innerHTML="";

    // for each element in the data
    const data = content.data.list;
    for (const item of data) {
        // create an object to represent the current item
        let value = new ToDoItem(item.todo, item.done);

         // create LI element
        const node = document.createElement("li");     
        
        // create text node and append to list item
        const textnode = document.createTextNode(value.todo);         
        node.appendChild(textnode);  

        // append node to list
        todolist.appendChild(node);
    }
}


async function clearlist(content)
{
     // get DOM element for list and clear its contents
    const todolist = document.getElementById("todolist");
    todolist.innerHTML="";
}

async function addtodo(e) {
    // stop the regular form submission
    e.preventDefault();

    // get the data from input box in form and embed in object
    const newtodo = document.getElementById("todo");
    const data = new ToDoItem(newtodo.value, false);

    // clear input box
    newtodo.value="";
    
    const mutationstring = `mutation {addtodo(input: {todo:"${data.todo}", done:"false" }){todo,done}}`

    // set up and make asynchronous POST to API endpoint
    const settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        body: JSON.stringify({query: mutationstring} )
    };
    await fetch('http://localhost:4000/graphql', settings);
};

async function clearall()
{
    let response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({query:"mutation { clearAll{todo} }" })
      })
    let content = await response.json();
    return content;
}

// set event handlers
window.onload = function(){
    // get to do list items and display
    gettodos()
        .then(data => showlist(data))

     // on form submit, add new to do item, get updated list of to do items, and display
    document.getElementById("addtodo").addEventListener('submit', async(e) => {
        addtodo(e)
            .then(gettodos)
            .then(data => showlist(data))
    });


    document.getElementById("clear").addEventListener('click', async() => {
        clearall()
        .then(data => clearlist(data))
    });
    
}