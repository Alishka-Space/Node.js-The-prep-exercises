/*week3/prep-exercise/server/users.js*/
import newDatabase from './database.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Change this boolean to true if you wish to keep your
// users between restart of your application
const isPersistent = false
const database = newDatabase({isPersistent})

// Create middlewares required for routes defined in app.js
// export const register = async (req, res) => {};
export const register = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const existingUser = database.find(user => user.username === username);
        if (existingUser) {
            throw new Error('Username already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {username, password: hashedPassword};
        const storedUser = database.create(user);

        res.status(201).json({ id: storedUser.id, username: storedUser.username });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = database.find(user => user.username === username);
        if (!user) {
            throw new Error('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const logout = () => {
    res.status(204).send();
}

export const getProfile = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = database.getById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.status(200).json({ id: user.id, username: user.username });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
// You can also create helper functions in this file to help you implement logic
// inside middlewares