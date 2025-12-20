import jwt from 'jsonwebtoken';

const token = jwt.sign(
    { userId: 'user1', role: 'user' },
    process.env.JWT_SECRET,
    {
        expiresIn: '1h'
    }
);

console.log(token);