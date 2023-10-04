const sequelize = require('./sequelize');
const User = require('./user');

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database');

        // Create the table if it doesn't exist
        await sequelize.sync();

        console.log('Table synced successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

module.exports = {
    initializeDatabase: initializeDatabase, // Export the function as initializeDatabase
}
