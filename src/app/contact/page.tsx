'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.css';

const contacts = [
  { icon: '📞', label: 'Phone', value: '+91 84213 08297', href: 'tel:+918421308297' },
  { icon: '✉', label: 'Email', value: 'hello@weekendriders.in', href: 'mailto:hello@weekendriders.in' },
  { icon: '📸', label: 'Instagram', value: '@weekend_riders', href: 'https://instagram.com' },
  { icon: '📍', label: 'Basecamp', value: 'Pune, Maharashtra', href: '#' },
];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): Partial<FormState> => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setApiError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setSent(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className={styles.page}>
      <div className={`container ${styles.layout}`}>

        {/* ── Left: Info ─────────────────────────────────────────────── */}
        <div className={styles.infoCol}>
          <span className="label-caps" style={{ marginBottom: '12px', display: 'block' }}>Get in Touch</span>
          <h1 className={styles.title}>Let's Plan Your<br />Adventure</h1>
          <p className={styles.desc}>
            Planning your next Sahyadri adventure or have questions about our upcoming
            expeditions? We're here to help. Our basecamp is in the heart of Pune.
          </p>

          <div className={styles.contactCards}>
            {contacts.map(({ icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className={styles.contactCard}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
              >
                <span className={styles.contactIcon}>{icon}</span>
                <div>
                  <span className={styles.contactLabel}>{label}</span>
                  <span className={styles.contactValue}>{value}</span>
                </div>
                <span className={styles.contactArrow}>→</span>
              </a>
            ))}
          </div>

          <div className={styles.quickLinks}>
            <h4 className={styles.quickTitle}>Quick Links</h4>
            <div className={styles.quickGrid}>
              <Link href="/" className={styles.quickLink}>🏠 Home</Link>
              <Link href="/#treks" className={styles.quickLink}>⛰ Treks</Link>
              <Link href="/about" className={styles.quickLink}>📖 About</Link>
              <Link href="/contact" className={styles.quickLink}>✉ Contact</Link>
            </div>
          </div>
        </div>

        {/* ── Right: Form ────────────────────────────────────────────── */}
        <div className={styles.formCol}>
          <div className={styles.formCard}>

            {sent ? (
              /* ── Success state ── */
              <div className={styles.successState}>
                <div className={styles.successIcon}>🎉</div>
                <h2 className={styles.successTitle}>Message Sent!</h2>
                <p className={styles.successDesc}>
                  Thanks, <strong>{form.name}</strong>! We've received your message and
                  will get back to you at <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  className="btn btn-primary"
                  style={{ justifyContent: 'center' }}
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  id="send-another-btn"
                >
                  Send Another Message
                </button>
                <Link href="/#treks" className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', marginTop: '8px' }}>
                  Browse Treks →
                </Link>
              </div>
            ) : (
              /* ── Form ── */
              <>
                <h2 className={styles.formTitle}>Send Us a Message</h2>
                <p className={styles.formSubtitle}>We typically respond within 24 hours.</p>

                <form
                  className={styles.form}
                  id="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="input-group">
                    <label htmlFor="contact-name">Your Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      className={`input-field ${errors.name ? styles.inputError : ''}`}
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={handleChange('name')}
                    />
                    {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="contact-email">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      className={`input-field ${errors.email ? styles.inputError : ''}`}
                      placeholder="rahul@example.com"
                      value={form.email}
                      onChange={handleChange('email')}
                    />
                    {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="contact-subject">Subject *</label>
                    <input
                      id="contact-subject"
                      type="text"
                      className={`input-field ${errors.subject ? styles.inputError : ''}`}
                      placeholder="Trek inquiry / Booking question"
                      value={form.subject}
                      onChange={handleChange('subject')}
                    />
                    {errors.subject && <span className={styles.errMsg}>{errors.subject}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="contact-message">Message *</label>
                    <textarea
                      id="contact-message"
                      className={`input-field ${errors.message ? styles.inputError : ''}`}
                      rows={5}
                      placeholder="Tell us about your planned trek, group size, preferred dates…"
                      style={{ resize: 'vertical' }}
                      value={form.message}
                      onChange={handleChange('message')}
                    />
                    {errors.message && <span className={styles.errMsg}>{errors.message}</span>}
                  </div>

                  {apiError && (
                    <div style={{ color: '#e94560', background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '8px', fontSize: '14px' }}>
                      ⚠️ {apiError}
                    </div>
                  )}

                  <button
                    type="submit"
                    id="contact-submit"
                    className={`btn btn-primary w-full ${styles.submitBtn}`}
                    disabled={loading}
                  >
                    {loading
                      ? <span className={styles.loadingSpinner}>Sending…</span>
                      : 'Send Message →'
                    }
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
