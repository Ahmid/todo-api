var express = require ('express');
var bodyParser = require ('body-parser');

var app = express();
var PORT = process.env.PORT || 3005;
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send ('Todo API Root');
});

//GET /todos
app.get ('/todos', function (req, res) {
    res.json(todos);
});

//GET /todos/:id
app.get ('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id,10);
    var matchedTodo;

    todos.forEach (function (todo) {
        if (todoID === todo.id) {
            matchedTodo = todo;
        }
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    }
    else {
        res.status (404).send();
    }

    res.send ('Asking for todo with id of ' + req.params.id);
});

// POST /todos
app.post ('/todos', function (req, res) {
    var body = req.body;

    //add id to body
    body.id = todoNextID;
    todoNextID++;
    
    //push body into todo array
    todos.push(body);

    res.json(body);
});

app.listen(PORT, function () {
    console.log ('Express listening on port ' + PORT + '!');
});