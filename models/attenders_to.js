'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {


    class Attenders_to extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User, Event }) {
            // define association here
            this.belongsTo(User, { foreignKey: 'userId' })
        }
        toJSON() {
            return {...this.get(), id: undefined }
        }
    }

    Attenders_to.init({
        event_id: {
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
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            references: {
                model: 'User',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Attenders_to',
        freezeTableName: true
    });


    // User.hasOne(attenders_to); // This adds documentId attribute to attenders_to
    // User.belongsTo(attenders_to, {
    //     as: 'currentUser',
    //     foreignKey: 'currentUserId',
    //     constraints: false,
    //     allowNull: false
    // }); // This adds currentUserId attribute to document

    return Attenders_to
};