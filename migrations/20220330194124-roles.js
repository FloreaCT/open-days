'use strict';

module.exports = {
    async up(queryInterface, DataTypes) {

        await queryInterface.createTable('roles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            role: {
                type: DataTypes.STRING,
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
        }).then(function() { queryInterface.sequelize.query("INSERT INTO roles(role, createdAt, updatedAt) VALUES ('User', NOW(), NOW()),('Organizer',NOW(), NOW()),('Administrator',NOW(),NOW())") })

    },

    async down(queryInterface, DataTypes) {
        await queryInterface.dropTable('roles');

    }
};