import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { buildVerificationEmail } from './templates/verification.template';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    private transporter = nodemailer.createTransport({
        host: process.env['SMTP_HOST'],
        port: Number(process.env['SMTP_PORT'] ?? 587),
        secure: process.env['SMTP_PORT'] === '465',
        auth: {
            user: process.env['SMTP_USER'],
            pass: process.env['SMTP_PASS'],
        },
    });

    async sendVerificationEmail(to: string, token: string): Promise<void> {
        const verifyUrl = `${process.env['APP_URL']}/auth/verify-email?token=${token}`;

        await this.transporter.sendMail({
            from: `"${process.env['SMTP_FROM_NAME'] ?? 'App'}" <${process.env['SMTP_FROM']}>`,
            to,
            subject: 'Potvrďte svůj email',
            html: buildVerificationEmail(verifyUrl),
        });

        this.logger.log(`Verification email sent to ${to}`);
    }
}