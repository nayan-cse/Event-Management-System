import pool from '../../../../utils/db';
import bcrypt from 'bcryptjs';
import logger from '../../../../utils/logger';

export async function POST(req) {
    const { name, email, password, role } = await req.json();

    try {
        // Check if user already exists
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            logger.warn(`Register API - User already exists: ${email}`);
            return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role || 'attendee']
        );

        logger.info(`Register API - User registered successfully: ${email}`);
        return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
    } catch (error) {
        logger.error(`Register API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
