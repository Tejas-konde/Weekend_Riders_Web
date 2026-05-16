import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Basic server-side validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Create a Nodemailer transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,   // your Gmail address (App Password sender)
        pass: process.env.GMAIL_PASS,   // Gmail App Password (NOT your normal password)
      },
    });

    await transporter.sendMail({
      from: `"Weekend Riders Contact" <${process.env.GMAIL_USER}>`,
      to: 'weekendsriders@gmail.com',
      replyTo: email,                   // reply goes directly to the customer
      subject: `[Weekend Riders] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
          <div style="background: #1a1a2e; padding: 24px; text-align: center;">
            <h1 style="color: #e94560; margin: 0; font-size: 24px;">🏔 Weekend Riders</h1>
            <p style="color: #aaa; margin: 6px 0 0;">New Contact Form Submission</p>
          </div>
          <div style="padding: 32px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; width: 120px; font-weight: bold;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #222;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-weight: bold;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #222;"><a href="mailto:${email}" style="color: #e94560;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-weight: bold;">Subject</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #222;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 24px;">
              <p style="color: #888; font-weight: bold; margin: 0 0 8px;">Message</p>
              <div style="background: #f4f4f4; border-left: 4px solid #e94560; padding: 16px; border-radius: 4px; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          <div style="background: #f9f9f9; padding: 16px; text-align: center; color: #aaa; font-size: 12px;">
            This message was sent via the Weekend Riders contact form. Reply directly to this email to respond to ${name}.
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }
}
