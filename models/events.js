'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Event extends Model {}
    Event.init({
        organizerid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            references: {
                model: 'User',
                key: 'id'
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        image: DataTypes.BLOB,
    }, {
        sequelize,
        modelName: 'Event'

    });

    return Event
};