import pool from '../../../../utils/db';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import logger from '../../../../utils/logger';

export async function POST(req) {
    const { email } = await req.json();

    try {
        // Check if user exists
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            logger.warn(`Forgot Password API - User not found: ${email}`);
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 400 });
        }

        // Generate a password reset token
        const resetToken = jwt.sign({ userId: user[0].id },
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );

        // Save the reset token in the database
        await pool.query('UPDATE users SET reset_token = ? WHERE id = ?', [resetToken, user[0].id]);

        // Send the reset token via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${process.env.BASE_URL}/reset-password?token=${resetToken}`,
        };

        await transporter.sendMail(mailOptions);

        logger.info(`Forgot Password API - Reset token sent to: ${email}`);
        return new Response(JSON.stringify({ message: 'Reset token sent' }), { status: 200 });
    } catch (error) {
        logger.error(`Forgot Password API - Error: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
