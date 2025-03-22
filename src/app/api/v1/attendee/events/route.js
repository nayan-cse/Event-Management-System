import pool from '../../../../utils/db';
import jwt from 'jsonwebtoken';
import logger from '../../../../utils/logger';

export async function GET(req) {
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader ? .split(' ')[1];

    if (!accessToken) {
        logger.warn('Events API - No access token found');
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Fetch events the attendee has registered for
        const [events] = await pool.query(
            'SELECT e.* FROM events e JOIN registrations r ON e.id = r.event_id WHERE r.user_id = ?', [decoded.userId]
        );

        logger.info(`Events API - Events fetched for user: ${decoded.userId}`);
        return new Response(JSON.stringify({ events }), { status: 200 });
    } catch (error) {
        logger.error(`Events API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }
}
