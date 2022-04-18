const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class User extends Model {
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
            unique: true,
            validate: {
                notNull: { msg: 'You need to insert a email' },
                notEmpty: { msg: 'email must not be empty' },
                isEmail: { msg: "Must be a valid email" }
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: true
            }

        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        university: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Roles',
                key: 'id'
            },
            defaultValue: "1"
        }

    }, {
        sequelize,
        modelName: 'User',

    });

    User.associate = (models) => {

        User.hasOne(models.Role, {
                as: "role",
                foreignKey: "userId"
            }),
            User.hasOne(models.Event, {
                as: 'event',
                foreignKey: 'userId',
                onDelete: 'cascad'
            }),

            User.hasMany(models.Attenders_to, {
                as: 'attenders',
                foreignKey: 'userId',
                onDelete: 'cascade'
            })
    }


    return User
};