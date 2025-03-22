import pool from '../../../../utils/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import logger from '../../../../utils/logger';


export async function GET(req) {
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader ? .split(' ')[1];

    if (!accessToken) {
        logger.warn('Profile API - No access token found');
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Fetch user profile
        const [user] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.userId]);
        if (user.length === 0) {
            logger.warn(`Profile API - User not found: ${decoded.userId}`);
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        logger.info(`Profile API - Profile fetched for user: ${user[0].email}`);
        return new Response(JSON.stringify({ user: user[0] }), { status: 200 });
    } catch (error) {
        logger.error(`Profile API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }
}

export async function PUT(req) {
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader ? .split(' ')[1];

    if (!accessToken) {
        logger.warn('Profile API - No access token found');
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const { name, email, password } = await req.json();

    try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Hash the new password (if provided)
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update user profile
        await pool.query(
            'UPDATE users SET name = ?, email = ?, password = COALESCE(?, password) WHERE id = ?', [name, email, hashedPassword, decoded.userId]
        );

        logger.info(`Profile API - Profile updated for user: ${decoded.userId}`);
        return new Response(JSON.stringify({ message: 'Profile updated successfully' }), { status: 200 });
    } catch (error) {
        logger.error(`Profile API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }
}
