const bcrypt = require('bcrypt');

// Function to hash a password
async function hashPassword(plaintextPassword) {
    const saltRounds = 10; // Number of salt rounds

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(plaintextPassword, salt);
        return hash;
    } catch (error) {
        throw error;
    }
}

// Function to compare a password with a stored hash
async function comparePassword(enteredPassword, storedHashedPassword) {
    try {
        const match = await bcrypt.compare(enteredPassword, storedHashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}

module.exports = {
  hashPassword,
 comparePassword,
};
