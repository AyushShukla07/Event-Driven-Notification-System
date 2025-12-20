import jwt from 'jsonwebtoken';

const token = jwt.sign(
    { userId: 'user1' },
    'supersecretkey',
    {
        expiresIn: '1h'
    }
);

console.log(token);