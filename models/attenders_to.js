'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {


    class Attenders_to extends Model {
        toJSON() {
            return {...this.get(), id: undefined }
        }
    }

    Attenders_to.init({
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            references: {
                model: 'Events',
                key: 'id'
            },
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Attenders_to',
        freezeTableName: true
    });


    Attenders_to.associations = (models) => {
        Attenders_to.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId'
            }),
            Attenders_to.hasOne(models.Event, {
                as: 'event',
                foreignKey: 'eventId'
            })
    }


    return Attenders_to
};