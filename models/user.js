var bcrypt = require ('bcryptjs');
var _ = require ('underscore');
var cryptojs = require ('crypto-js');
var jwt = require ('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define ('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, //makes sure that there is no other value of this field in the database (signup with existing email)
            validate: {
                isEmail: true
            }
        },
        salt: { //since if 2 pass are abc123 then the hash would be the same, so salt adds random set of characters before hash, to make it different hash
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING 
        },
        password: {
            type: DataTypes.VIRTUAL, //does not put it in database
            allowNull: false,
            validate: {
                len: [7,100],
                
            },
            set: function (value) { //override set with password field
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue ('password', value);
                this.setDataValue ('salt', salt);
                this.setDataValue ('password_hash', hashedPassword);
            }
        }
    }, {
        hooks: { //in order for not to accept same email with same letters but different case
            beforeValidate: function (user, options) {
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        },
        classMethods: {
            authenticate: function (body) {
                return new Promise(function (resolve, reject) {

                    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }
                    
                    user.findOne({
                        where: {
                            email: body.email
                        }
                    }).then(function (user) { //if success
                        if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                            return reject();
                        }
                        resolve(user);
                    }, function (e) { //if fail
                        reject();
                    });
                });
            }
        },
        instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON();
                return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');    
            },
            generateToken: function (type) {
                if (!_.isString(type)) {
                    return undefined;
                }

                try {
                    var stringData = JSON.stringify({id: this.get('id'), type: type});
                    var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#').toString();
                    var token = jwt.sign({
                        token: encryptedData
                    }, 'qwerty098');

                    return token;
                } catch (e) {
                    return undefined;
                }
            }
        }
    });
    return user;
};