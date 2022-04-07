'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Role }) {
            // define association here
            this.hasOne(Role)
        }
        toJSON() {
            return {...this.get(), id: undefined }
        }
    }
    User.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'You need to insert a email' },
                notEmpty: { msg: 'email must not be empty' },
                isEmail: { msg: "Must be a valid email" }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        university: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            defaultValue: "Not at university"
        },
        hasRole: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            references: {
                model: 'Role',
                key: 'id'
            },
            defaultValue: "1"
        }

    }, {
        sequelize,
        modelName: 'User',
    });

    // User.hasOne(attenders_to); // This adds documentId attribute to attenders_to
    // User.belongsTo(attenders_to, {
    //     as: 'currentUser',
    //     foreignKey: 'currentUserId',
    //     constraints: false,
    //     allowNull: false
    // }); // This adds currentUserId attribute to document

    return User
};