var express = require ('express');
var bodyParser = require ('body-parser');
var _ = require ('underscore');

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
    var matchedTodo = _.findWhere(todos, {id: todoID});

    if (matchedTodo) {
        res.json(matchedTodo);
    }
    else {
        res.status (404).send();
    }

    res.send ('Asking for todo with id of ' + req.params.id);
});

//POST /todos
app.post ('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }
 
    body.description = body.description.trim(); //get the spaced cut   

    //add id to body
    body.id = todoNextID;
    todoNextID++;
    
    //push body into todo array
    todos.push(body);

    res.json(body);
});

//Delete /todos/:id
app.delete ('/todos/:id', function (req, res) {
    var todoId = parseInt (req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (!matchedTodo) {
        res.status(404).json({"Error": "no todo found with that id"}).send();
    }
    else {
        todos = _.without (todos, matchedTodo);
        res.json(matchedTodo);
    }
});


app.listen(PORT, function () {
    console.log ('Express listening on port ' + PORT + '!');
});