import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const token = jwt.sign(
    { userId: 'user1', role: 'user' },
    process.env.JWT_SECRET,
    {
        expiresIn: '1h'
    }
);

console.log(token); 