module.exports = function (sequelize, DataTypes) {
    return sequelize.define ('todo', { 
        description : {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 256] //Description must not be null, and it must be a string of minimum length of 1 and max of 256
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
};