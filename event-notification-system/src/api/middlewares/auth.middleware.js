import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorizarion;

    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({
        error: 'Unauthorized'
    });

    const token = authHeader.split(' ')[1];

    // if (!token) return res.status(401).json({
    //     error: 'Token Missing'
    // });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            error: 'Invalid Token'
        });
    }
};