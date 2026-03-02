import nodemailer from 'nodemailer';

const isGmail = (process.env.SMTP_HOST || '').includes('gmail');

const transporter = nodemailer.createTransport(
    isGmail
        ? {
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        }
        : {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: parseInt(process.env.SMTP_PORT || '587') === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        }
);

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('SMTP credentials not configured');
        return { ok: false, error: 'SMTP not configured' };
    }

    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SITE_NAME || 'The Faces 2026'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log('Message sent: %s', info.messageId);
        return { ok: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { ok: false, error };
    }
}
