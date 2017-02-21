//sequelize let us manage our data like javascript object arrays
var Sequelize = require ('sequelize');
var sequelize = new Sequelize (undefined, undefined, undefined,  {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define ('todo', { 
    description : {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 256] //Description must not be null, and it must be a string of minimum length of 1 and max of 256
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});
 
var User = sequelize.define ('user', {
    email: Sequelize.STRING
});

//Sequelize knows how to create foreign keys with this association (1 to many)
Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
    //force: true
}).then(function () {
    console.log ('Everything is synced');

    User.findById(1).then (function (user) {
        user.getTodos({
            where: {
                completed: true
            }
        }).then (function (todos) {
            todos.forEach(function (todo) {
                console.log(todo.toJSON());
            })
        });
    });
    // User.create ({
    //     email: 'a@hotmail.com'
    // }).then (function () {
    //     return Todo.create ({
    //         description: 'Clean yard',
    //     });
    // }).then (function (todo) {
    //     User.findById(1).then(function (user) {
    //         user.addTodo(todo);
    //     });
    // });
   
}); 

