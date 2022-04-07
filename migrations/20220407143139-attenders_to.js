'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {

        await queryInterface.createTable('attenders_to', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true
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
                }
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },

    async down(queryInterface, DataTypes) {
        await queryInterface.dropTable('attenders_to');

    }
};