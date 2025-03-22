import pool from '../../../../utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../../../../utils/logger';

export async function POST(req) {
    const { email, password } = await req.json();

    try {
        // Check if user exists
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            logger.warn(`Login API - User not found: ${email}`);
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400 });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if (!isValidPassword) {
            logger.warn(`Login API - Invalid password for user: ${email}`);
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400 });
        }

        // Generate access token
        const accessToken = jwt.sign({ userId: user[0].id, role: user[0].role },
            process.env.JWT_SECRET, { expiresIn: '1h' } // Short-lived access token
        );

        // Generate refresh token
        const refreshToken = jwt.sign({ userId: user[0].id },
            process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' } // Long-lived refresh token
        );

        // Save refresh token in the database
        await pool.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user[0].id]);

        logger.info(`Login API - User logged in successfully: ${email}`);
        return new Response(JSON.stringify({ accessToken, refreshToken }), { status: 200 });
    } catch (error) {
        logger.error(`Login API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
