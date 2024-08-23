"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert roles
    await queryInterface.bulkInsert("Roles", [
      {
        role: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "Organizer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "Administrator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert users
    await queryInterface.bulkInsert("Users", [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        city: "New York",
        university: "NYU",
        password: "password123",
        roleId: 1,
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "0987654321",
        city: "Los Angeles",
        university: "UCLA",
        password: "password123",
        roleId: 2,
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert events
    await queryInterface.bulkInsert("Events", [
      {
        description: "Open Day at NYU",
        title: "NYU Open Day",
        begin_at: new Date(),
        ends_at: new Date(),
        image: "/images/banner_uni.jpg",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: "Open Day at UCLA",
        title: "UCLA Open Day",
        begin_at: new Date(),
        ends_at: new Date(),
        image: "/images/banner_uni.jpg",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert attenders
    await queryInterface.bulkInsert("Attenders_to", [
      {
        eventId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Attenders_to", null, {});
    await queryInterface.bulkDelete("Events", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
