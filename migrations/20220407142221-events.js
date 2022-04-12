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
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            begin_at: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notEmpty: true
                }

            },
            ends_at: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                createdAt: {
                    allowNull: false,
                    type: DataTypes.DATE
                },
                updatedAt: {
                    allowNull: false,
                    type: DataTypes.DATE
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
        })

    },

    async down(queryInterface, DataTypes) {
        await queryInterface.dropTable('events');

    }
}