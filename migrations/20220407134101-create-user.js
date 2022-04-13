'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
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
                    notEmpty: true
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
                defaultValue: "Not at University"
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true
                },
                defaultValue: "1",
                references: {
                    model: 'Roles',
                    key: 'id'
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
        await queryInterface.dropTable('users');
    }

}