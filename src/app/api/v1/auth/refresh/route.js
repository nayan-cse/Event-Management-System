import pool from '../../../../utils/db';
import jwt from 'jsonwebtoken';
import logger from '../../../../utils/logger';

export async function POST(req) {
    const { refreshToken } = await req.json();

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if the refresh token exists in the database
        const [user] = await pool.query('SELECT * FROM users WHERE id = ? AND refresh_token = ?', [decoded.userId, refreshToken]);
        if (user.length === 0) {
            logger.warn(`Refresh API - Invalid refresh token`);
            return new Response(JSON.stringify({ message: 'Invalid refresh token' }), { status: 401 });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ userId: user[0].id, role: user[0].role },
            process.env.JWT_SECRET, { expiresIn: '15m' } // New access token expires in 15 minutes
        );

        logger.info(`Refresh API - New access token generated for user: ${user[0].email}`);
        return new Response(JSON.stringify({ accessToken }), { status: 200 });
    } catch (error) {
        logger.error(`Refresh API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Invalid refresh token' }), { status: 401 });
    }
}
