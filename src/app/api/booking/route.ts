import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const {
      bookingId,
      trekName,
      trekDate,
      trekDuration,
      name,
      email,
      phone,
      emergency,
      slots,
      pricePerSlot,
      totalAmount,
      paymentRef,
    } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,   // weekendsriders@gmail.com
        pass: process.env.GMAIL_PASS,   // App password (no spaces)
      },
    });

    const bookedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const tableRow = (label: string, value: string, highlight = false, alt = false) => `
      <tr style="background:${alt ? '#f7fcf7' : '#ffffff'};">
        <td style="padding:11px 16px;color:#555;font-size:13px;font-weight:600;border-bottom:1px solid #e8f0e9;width:38%;">${label}</td>
        <td style="padding:11px 16px;color:${highlight ? '#2d7a3f' : '#1a1a1a'};font-size:13px;font-weight:${highlight ? '700' : '500'};border-bottom:1px solid #e8f0e9;">${value}</td>
      </tr>`;

    // ─── ADMIN EMAIL ────────────────────────────────────────────────────────────
    const adminEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Booking — Weekend Riders</title></head>
<body style="margin:0;padding:0;background:#eef3ee;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef3ee;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(27,46,32,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1B2E20 0%,#2d4f35 100%);padding:32px 36px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#8fbb96;text-transform:uppercase;font-weight:600;">Weekend Riders</p>
            <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:700;">🔔 New Booking Received</h1>
            <p style="margin:10px 0 0;font-size:13px;color:#a8c9ad;">Admin Notification — Action Required</p>
          </td>
        </tr>

        <!-- Alert Banner -->
        <tr>
          <td style="background:#F47D31;padding:12px 36px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#ffffff;font-weight:600;">
              💰 ₹${Number(totalAmount).toLocaleString('en-IN')} collected — ${slots} slot${Number(slots) > 1 ? 's' : ''} booked for <strong>${trekName}</strong>
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <h2 style="margin:0 0 20px;font-size:17px;color:#1B2E20;font-weight:700;border-bottom:2px solid #e8f0e9;padding-bottom:12px;">
              📋 Booking Details — <span style="color:#2d7a3f;">${bookingId}</span>
            </h2>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0eae1;border-radius:8px;overflow:hidden;">
              ${tableRow('Booking ID', `<strong>${bookingId}</strong>`, true, false)}
              ${tableRow('Trek', trekName, false, true)}
              ${tableRow('Date', trekDate, false, false)}
              ${tableRow('Duration', trekDuration, false, true)}
              ${tableRow('Slots Booked', `${slots} person${Number(slots) > 1 ? 's' : ''}`, false, false)}
              ${tableRow('Price / Slot', `₹${Number(pricePerSlot).toLocaleString('en-IN')}`, false, true)}
              ${tableRow('Payment Ref', paymentRef || 'Not provided', false, false)}
            </table>

            <h2 style="margin:28px 0 16px;font-size:17px;color:#1B2E20;font-weight:700;border-bottom:2px solid #e8f0e9;padding-bottom:12px;">👤 Customer Details</h2>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0eae1;border-radius:8px;overflow:hidden;">
              ${tableRow('Full Name', name, false, false)}
              ${tableRow('Email', `<a href="mailto:${email}" style="color:#2d7a3f;text-decoration:none;">${email}</a>`, false, true)}
              ${tableRow('Phone', `<a href="tel:${phone}" style="color:#2d7a3f;text-decoration:none;">${phone}</a>`, false, false)}
              ${tableRow('Emergency Contact', emergency, false, true)}
            </table>

            <!-- Total Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:linear-gradient(135deg,#1B2E20 0%,#2d4f35 100%);border-radius:10px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <p style="margin:0 0 4px;font-size:11px;color:#8fbb96;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Total Amount Received</p>
                  <p style="margin:0;font-size:36px;font-weight:800;color:#ffffff;">₹${Number(totalAmount).toLocaleString('en-IN')}</p>
                  <p style="margin:6px 0 0;font-size:12px;color:#a8c9ad;">${slots} slot${Number(slots) > 1 ? 's' : ''} × ₹${Number(pricePerSlot).toLocaleString('en-IN')} per person</p>
                </td>
              </tr>
            </table>

            <p style="margin:20px 0 0;font-size:12px;color:#888;text-align:center;">Booking received on ${bookedAt} IST</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7fcf7;border-top:1px solid #e0eae1;padding:16px 36px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#999;">Weekend Riders · Sahyadri Explorers · weekendsriders@gmail.com · +91 84213 08297</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ─── CUSTOMER EMAIL ──────────────────────────────────────────────────────────
    const customerEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Booking Confirmed — Weekend Riders</title></head>
<body style="margin:0;padding:0;background:#eef3ee;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef3ee;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(27,46,32,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1B2E20 0%,#2d4f35 100%);padding:36px 36px 28px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#8fbb96;text-transform:uppercase;font-weight:600;">Weekend Riders</p>
            <h1 style="margin:0;font-size:26px;color:#ffffff;font-weight:700;">🎉 You're All Set!</h1>
            <p style="margin:10px 0 0;font-size:14px;color:#a8c9ad;">Your trek booking is confirmed. The adventure begins!</p>
          </td>
        </tr>

        <!-- Green Tick Banner -->
        <tr>
          <td style="background:#2d7a3f;padding:14px 36px;text-align:center;">
            <p style="margin:0;font-size:14px;color:#ffffff;font-weight:600;">
              ✅ Booking ID: <strong>${bookingId}</strong>
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px;">
            <p style="margin:0 0 6px;font-size:18px;color:#1B2E20;font-weight:700;">Hi ${name}! 👋</p>
            <p style="margin:0 0 28px;font-size:14px;color:#555;line-height:1.7;">
              We're thrilled to have you on the <strong>${trekName}</strong> expedition!
              Your ${slots} slot${Number(slots) > 1 ? 's have' : ' has'} been reserved and your payment of
              <strong style="color:#2d7a3f;">₹${Number(totalAmount).toLocaleString('en-IN')}</strong> is noted.
              Below are your complete booking details.
            </p>

            <!-- Summary Card -->
            <div style="background:#f7fcf7;border:1.5px solid #b8ddbf;border-radius:10px;overflow:hidden;margin-bottom:24px;">
              <div style="background:#e8f5ea;padding:12px 20px;border-bottom:1px solid #b8ddbf;">
                <p style="margin:0;font-size:13px;font-weight:700;color:#1B2E20;">📋 Booking Summary</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${tableRow('Booking ID', `<strong>${bookingId}</strong>`, true, false)}
                ${tableRow('Trek', `<strong>${trekName}</strong>`, false, true)}
                ${tableRow('Date', trekDate, false, false)}
                ${tableRow('Duration', trekDuration, false, true)}
                ${tableRow('Slots Booked', `${slots} person${Number(slots) > 1 ? 's' : ''}`, false, false)}
                ${tableRow('Price / Person', `₹${Number(pricePerSlot).toLocaleString('en-IN')}`, false, true)}
                ${tableRow('Total Paid', `<strong style="color:#2d7a3f;font-size:15px;">₹${Number(totalAmount).toLocaleString('en-IN')}</strong>`, true, false)}
              </table>
            </div>

            <!-- Next Step Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e1;border:1.5px solid #ffe082;border-radius:10px;margin-bottom:24px;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#b45309;">📱 Important Next Step</p>
                  <p style="margin:0;font-size:13px;color:#666;line-height:1.7;">
                    Please share your <strong>UPI payment screenshot</strong> to confirm your seat:
                  </p>
                  <table style="margin-top:12px;" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:4px 0;">
                        <a href="https://wa.me/918421308297" style="color:#2d7a3f;font-weight:600;font-size:13px;text-decoration:none;">💬 WhatsApp: +91 84213 08297</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;">
                        <a href="mailto:weekendsriders@gmail.com" style="color:#2d7a3f;font-weight:600;font-size:13px;text-decoration:none;">✉ Email: weekendsriders@gmail.com</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- What to Bring -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7f1;border:1px solid #c3ddc6;border-radius:10px;margin-bottom:24px;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1B2E20;">🎒 Quick Packing Reminders</p>
                  <p style="margin:3px 0;font-size:12px;color:#555;">• Sturdy trekking shoes &amp; moisture-wicking clothes</p>
                  <p style="margin:3px 0;font-size:12px;color:#555;">• Water bottles (min 2L), energy snacks &amp; personal medicines</p>
                  <p style="margin:3px 0;font-size:12px;color:#555;">• Rain cover / poncho (Sahyadri weather is unpredictable)</p>
                  <p style="margin:3px 0;font-size:12px;color:#555;">• Valid ID proof for all participants</p>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#777;line-height:1.7;text-align:center;">
              Questions? Reply to this email or WhatsApp us anytime.<br>
              <strong style="color:#1B2E20;">Weekend Riders team is always with you on the trail. 🏔</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:linear-gradient(135deg,#1B2E20 0%,#2d4f35 100%);padding:22px 36px;text-align:center;">
            <p style="margin:0 0 6px;font-size:13px;color:#a8c9ad;font-weight:600;">Weekend Riders · Sahyadri Explorers</p>
            <p style="margin:0;font-size:11px;color:#6b9970;">weekendsriders@gmail.com · +91 84213 08297 · Pune, Maharashtra</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // ─── SEND EMAILS ────────────────────────────────────────────────────────────

    // 1️⃣ Admin notification → weekendsriders@gmail.com
    await transporter.sendMail({
      from: `"Weekend Riders" <${process.env.GMAIL_USER}>`,
      to: 'weekendsriders@gmail.com',
      subject: `🔔 [New Booking] ${bookingId} — ${name} | ${slots} slot(s) | ₹${Number(totalAmount).toLocaleString('en-IN')} | ${trekName}`,
      html: adminEmailHtml,
    });

    // 2️⃣ Customer confirmation → customer's email
    await transporter.sendMail({
      from: `"Weekend Riders" <${process.env.GMAIL_USER}>`,
      to: email,
      replyTo: 'weekendsriders@gmail.com',
      subject: `🎉 Booking Confirmed — ${trekName} | ${bookingId} | Weekend Riders`,
      html: customerEmailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Booking email error:', err);
    return NextResponse.json(
      { error: 'Failed to send confirmation emails. Please contact weekendsriders@gmail.com.' },
      { status: 500 }
    );
  }
}
