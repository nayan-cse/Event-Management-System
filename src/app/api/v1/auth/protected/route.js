import jwt from 'jsonwebtoken';
import logger from '../../../../utils/logger';

export async function GET(req) {
    const token = req.headers.get('authorization') ? .split(' ')[1];

    if (!token) {
        logger.warn(`Protected API - No token provided`);
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info(`Protected API - User accessed: ${decoded.userId}`);
        return new Response(JSON.stringify({ message: 'You are authenticated', user: decoded }), { status: 200 });
    } catch (error) {
        logger.error(`Protected API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }
}
