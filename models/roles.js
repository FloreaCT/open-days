'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Role extends Model {}
    Role.init({
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }

        }
    }, {
        sequelize,
        modelName: 'Role',
    });

    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            as: 'user',
            foreignKey: 'userId',
            through: 'id'
        })
    }
    return Role
};