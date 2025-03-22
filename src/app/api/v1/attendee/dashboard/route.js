import pool from '../../../../utils/db';
import jwt from 'jsonwebtoken';
import logger from '../../../../utils/logger';

export async function GET(req) {
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader ? .split(' ')[1];

    if (!accessToken) {
        logger.warn('Dashboard API - No access token found');
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Fetch user details
        const [user] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.userId]);
        if (user.length === 0) {
            logger.warn(`Dashboard API - User not found: ${decoded.userId}`);
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Fetch events for the user
        let events = [];
        if (user[0].role === 'organizer' || user[0].role === 'admin') {
            const [eventResults] = await pool.query('SELECT * FROM events WHERE organizer_id = ?', [decoded.userId]);
            events = eventResults;
        } else if (user[0].role === 'attendee') {
            const [eventResults] = await pool.query(
                'SELECT e.* FROM events e JOIN registrations r ON e.id = r.event_id WHERE r.user_id = ?', [decoded.userId]
            );
            events = eventResults;
        }

        logger.info(`Dashboard API - Dashboard data fetched for user: ${user[0].email}`);
        return new Response(JSON.stringify({ user: user[0], events }), { status: 200 });
    } catch (error) {
        logger.error(`Dashboard API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }
}
