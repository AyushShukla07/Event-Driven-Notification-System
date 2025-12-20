import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({
        error: 'Authorization header missing'
    });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({
        error: 'Token Missing'
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        return res.status(403).json({
            error: 'Invalid Token'
        });
    }
};