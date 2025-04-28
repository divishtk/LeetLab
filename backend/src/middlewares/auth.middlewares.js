import jwt from 'jsonwebtoken';
import {
    db
} from '../libs/db.js';
db
export const authMiddleware = async (req, res, next) => {
    console.log(process.env.JWT_SECRET);
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized , no token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true
            }
        })
        console.log(user);
        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized, invalid token'
        });
    }




}