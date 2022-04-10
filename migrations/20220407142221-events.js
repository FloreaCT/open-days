'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {

        await queryInterface.createTable('events', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            organizerid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            image: {
                type: DataTypes.BLOB('medium'),
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
        await queryInterface.dropTable('events');

    }
};