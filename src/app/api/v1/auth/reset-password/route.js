import pool from '../../../../utils/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import logger from '../../../../utils/logger';

export async function POST(req) {
    const { token, newPassword } = await req.json();

    try {
        // Verify the reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the reset token exists in the database
        const [user] = await pool.query('SELECT * FROM users WHERE id = ? AND reset_token = ?', [decoded.userId, token]);
        if (user.length === 0) {
            logger.warn(`Reset Password API - Invalid reset token`);
            return new Response(JSON.stringify({ message: 'Invalid reset token' }), { status: 401 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password and clear the reset token
        await pool.query('UPDATE users SET password = ?, reset_token = NULL WHERE id = ?', [hashedPassword, user[0].id]);

        logger.info(`Reset Password API - Password reset for user: ${user[0].email}`);
        return new Response(JSON.stringify({ message: 'Password reset successfully' }), { status: 200 });
    } catch (error) {
        logger.error(`Reset Password API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Invalid reset token' }), { status: 401 });
    }
}
