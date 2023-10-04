const express = require('express');
const bodyParser = require('body-parser');
const dbconnection = require('./dbconnection')
const passwords = require('./passwordUtill')
const app = express();
const port = 3000;
const User = require('./user')

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// MySQL Database Connection
dbconnection.initializeDatabase()

// Define API Routes here
app.post('/create-admin-user', async (req, res) => {
    try{
    const { username, email, phonenumber, password } = req.body;
    let hashPassword = await passwords.hashPassword(password)
    let type = "Admin"
    let status = "ACTIVE"
    //const newUser = { username, email, phonenumber, hashedPassword, type, status };

    let userDetails = {
        "username": username,
        "email": email,
        "phonenumber": phonenumber,
        "password": hashPassword,
        "type": type,
        "status": status
    }

    const newUser = await User.create(userDetails);

    console.log('User created successfully:', newUser.toJSON());

    res.status(201).json({ message: 'User created successfully' });
} catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
}
});

app.post('/api/create-user', async (req, res) => {
    try{
    let { username, email, phonenumber, password } = req.body;
    let type = "non-admin"
    let hashedPassword = await passwords.hashPassword(password)
    //const newUser = { username, email, phonenumber, hashedPassword, type };

    let userDetails = {
        "username": username,
        "email": email,
        "phonenumber": phonenumber,
        "password": hashedPassword,
        "type": type,
    }

    const newUser = await User.create(userDetails);

    console.log('User created successfully:', newUser.toJSON());

    res.status(201).json({ message: 'User created successfully' });
} catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
}
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await passwords.comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }else if(user.status == "ACTIVE"){
            res.status(200).json({ message: 'Login successful',accountType:user.type });
        }else{
            res.status(201).json({ message: 'Account is not yet active' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/users-activator', async (req, res) => {
    const { email }= req.body;

    try {
        // Find the user by ID
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        let updatedUserData = {status:"ACTIVE"}

        // Update the user's data
        await user.update(updatedUserData);

        res.status(200).json({ message: 'User account activated successfully' });
    } catch (error) {
        console.error('Error activating user account:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/password-change', async (req, res) => {
    const { email,oldpassword,newpassword }= req.body;

    try {
        // Find the user by ID
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await passwords.comparePassword(oldpassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        let newhashPassword = await passwords.hashPassword(newpassword)
        let updatedUserpassword = {password:newhashPassword}

        // Update the user's data
        await user.update(updatedUserpassword);

        res.status(200).json({ message: 'User password changed successfully' });
    } catch (error) {
        console.error('Error in changing user password:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        let hashPassword = await passwords.hashPassword(password)
        let updatedUserpassword = {password:hashPassword}
        await user.update(updatedUserpassword);

        res.status(200).json({ message: 'User password changed successfully' });
        
    } catch (error) {
        console.error('Error in changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
