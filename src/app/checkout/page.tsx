'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTrekStore } from '@/store/trekStore';
import styles from './page.module.css';

// ─── Step indicators ──────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Your Details', icon: '👤' },
  { id: 2, label: 'Payment', icon: '💳' },
  { id: 3, label: 'Confirmation', icon: '✅' },
];

// ─── UPI QR simulation ────────────────────────────────────────────────────────

function QRCode() {
  // Deterministic pattern so it doesn't flicker on re-render
  const cells = Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    // Corner squares + pseudo-random middle
    const isCorner =
      (row < 3 && col < 3) ||
      (row < 3 && col > 4) ||
      (row > 4 && col < 3);
    return isCorner || ((row * 7 + col * 3 + 13) % 5 > 1);
  });

  return (
    <div className={styles.qrGrid}>
      {cells.map((filled, i) => (
        <div
          key={i}
          className={styles.qrCell}
          style={{ background: filled ? '#1B2E20' : 'transparent' }}
        />
      ))}
    </div>
  );
}

// ─── Main checkout content ────────────────────────────────────────────────────

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trekId = searchParams.get('trek') ?? '';
  const { getTrekById, bookSeat } = useTrekStore();
  const trek = getTrekById(trekId);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', emergency: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [slots, setSlots] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    success: boolean;
    message: string;
    bookingId?: string;
    totalAmount?: number;
    pricePerSlot?: number;
  } | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid 10-digit phone required';
    if (!form.emergency.trim()) e.emergency = 'Emergency contact is required';
    if (!agreed) e.agreed = 'Please accept the terms to proceed';
    return e;
  };

  const handleStep1Submit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = async () => {
    if (!trek) return;
    setLoading(true);
    // Simulate payment gateway verification delay
    await new Promise((r) => setTimeout(r, 2000));

    const finalPaymentRef = paymentRef || `UPI-${Date.now().toString(36).toUpperCase()}`;

    const outcome = bookSeat(trekId, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      emergency: form.emergency,
      slots: slots,
      paymentRef: finalPaymentRef,
    });

    if (outcome.success && outcome.bookingId) {
      try {
        await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: outcome.bookingId,
            trekName: trek.name,
            trekDate: trek.dateRange,
            trekDuration: trek.duration,
            name: form.name,
            email: form.email,
            phone: form.phone,
            emergency: form.emergency,
            slots: slots,
            pricePerSlot: outcome.pricePerSlot,
            totalAmount: outcome.totalAmount,
            paymentRef: finalPaymentRef,
          }),
        });
      } catch (err) {
        console.error('Failed to send confirmation email', err);
      }
    }

    setLoading(false);
    setBookingResult(outcome);
    if (outcome.success) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!trek) {
    return (
      <div className={styles.error}>
        <span style={{ fontSize: '3rem' }}>🏔</span>
        <h2>No Trek Selected</h2>
        <p>Please go back and select a trek from our curated collection.</p>
        <button className="btn btn-primary" onClick={() => router.push('/')}>← Browse Treks</button>
      </div>
    );
  }

  const isSoldOut = trek.seats <= 0;

  return (
    <div className={styles.page}>
      {/* ── Step Progress Bar ──────────────────────────────────────────── */}
      <div className={styles.progressBar}>
        <div className={styles.progressInner}>
          {STEPS.map((s, idx) => (
            <div key={s.id} className={styles.stepWrapper}>
              <div
                className={`${styles.stepCircle} ${
                  step > s.id ? styles.stepDone
                  : step === s.id ? styles.stepActive
                  : styles.stepPending
                }`}
              >
                {step > s.id ? '✓' : s.icon}
              </div>
              <span className={`${styles.stepLabel} ${step === s.id ? styles.stepLabelActive : ''}`}>
                {s.label}
              </span>
              {idx < STEPS.length - 1 && (
                <div className={`${styles.stepConnector} ${step > s.id ? styles.stepConnectorDone : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* ── Left Column ────────────────────────────────────────────────── */}
        <div className={styles.formCol}>

          {/* ── STEP 1: Trekker Details ──────────────────────────────────── */}
          {step === 1 && (
            <div className={styles.stepPanel}>
              <div className={styles.formHeader}>
                <button className={styles.backBtn} onClick={() => router.back()}>← Back</button>
                <h1 className={styles.title}>Trekker Details</h1>
                <p className={styles.subtitle}>
                  Fill in your information to reserve your spot on <strong>{trek.name}</strong>.
                </p>
              </div>

              {isSoldOut ? (
                <div className={styles.soldOutBox}>
                  <span>😔</span>
                  <h3>Trek Sold Out</h3>
                  <p>All seats for {trek.name} are filled. Please choose another trek.</p>
                  <button className="btn btn-primary" onClick={() => router.push('/')}>View Other Treks</button>
                </div>
              ) : (
                <form
                  className={styles.form}
                  onSubmit={(e) => { e.preventDefault(); handleStep1Submit(); }}
                  id="checkout-form"
                  noValidate
                >
                  <h3 className={styles.formSection}>Personal Information</h3>

                  <div className="input-group" style={{ marginBottom: '16px' }}>
                    <label htmlFor="slots">Number of Slots *</label>
                    <select
                      id="slots"
                      className="input-field"
                      value={slots}
                      onChange={(e) => setSlots(Number(e.target.value))}
                      style={{ appearance: 'auto' }}
                    >
                      {Array.from({ length: Math.min(10, trek.seats) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} Person{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="full-name">Full Name *</label>
                    <input
                      id="full-name"
                      className={`input-field ${errors.name ? styles.inputError : ''}`}
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                  </div>

                  <div className={styles.formRow}>
                    <div className="input-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        id="email"
                        className={`input-field ${errors.email ? styles.inputError : ''}`}
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        id="phone"
                        className={`input-field ${errors.phone ? styles.inputError : ''}`}
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                      {errors.phone && <span className={styles.errMsg}>{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="emergency">Emergency Contact (Name & Number) *</label>
                    <input
                      id="emergency"
                      className={`input-field ${errors.emergency ? styles.inputError : ''}`}
                      type="text"
                      placeholder="e.g. Rahul Sharma, +91 98765 00000"
                      value={form.emergency}
                      onChange={(e) => setForm({ ...form, emergency: e.target.value })}
                    />
                    {errors.emergency && <span className={styles.errMsg}>{errors.emergency}</span>}
                  </div>

                  <div className={styles.terms}>
                    <label className={styles.termsLabel}>
                      <input
                        id="agree-terms"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                      />
                      <span>
                        I agree to the <a href="#" className={styles.termsLink}>Terms & Conditions</a> and
                        acknowledge the inherent risks of trekking activities.
                      </span>
                    </label>
                    {errors.agreed && <span className={styles.errMsg}>{errors.agreed}</span>}
                  </div>

                  <button
                    id="proceed-to-payment-btn"
                    type="submit"
                    className={`btn btn-primary btn-lg w-full ${styles.submitBtn}`}
                  >
                    Continue to Payment →
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── STEP 2: Payment ──────────────────────────────────────────── */}
          {step === 2 && (
            <div className={styles.stepPanel}>
              <div className={styles.formHeader}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>← Edit Details</button>
                <h1 className={styles.title}>Complete Payment</h1>
                <p className={styles.subtitle}>
                  Scan the QR code or use the UPI ID to pay ₹{(trek.price * slots).toLocaleString('en-IN')}.
                </p>
              </div>

              <div className={styles.paymentPanel}>
                {/* UPI QR */}
                <div className={styles.upiBlock}>
                  <div className={styles.qrWrapper}>
                    <QRCode />
                    <span className={styles.qrLabel}>Scan to Pay</span>
                  </div>
                  <div className={styles.upiDetails}>
                    <div className={styles.upiRow}>
                      <span className={styles.upiKey}>UPI ID</span>
                      <span className={styles.upiVal}>tejaskonde45@fam</span>
                    </div>
                    <div className={styles.upiRow}>
                      <span className={styles.upiKey}>Amount</span>
                      <span className={styles.upiAmount}>₹{(trek.price * slots).toLocaleString('en-IN')}</span>
                    </div>
                    <div className={styles.upiRow}>
                      <span className={styles.upiKey}>Trek</span>
                      <span className={styles.upiVal}>{trek.name}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.paySteps}>
                  <h4 className={styles.payStepsTitle}>How to Pay</h4>
                  {[
                    'Open GPay, PhonePe, Paytm, or any UPI app.',
                    `Scan the QR code above or enter UPI ID: tejaskonde45@fam`,
                    `Pay exactly ₹${(trek.price * slots).toLocaleString('en-IN')} — add your name as the note.`,
                    'Take a screenshot of the payment confirmation.',
                    'Enter your UPI reference number below and click Confirm.',
                  ].map((step, i) => (
                    <div key={i} className={styles.payStep}>
                      <span className={styles.payStepNum}>{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <div className="input-group" style={{ marginTop: '24px' }}>
                  <label htmlFor="payment-ref">UPI Transaction / Reference Number (Optional)</label>
                  <input
                    id="payment-ref"
                    className="input-field"
                    type="text"
                    placeholder="e.g. 432156789012"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#737872' }}>
                    You can also share via WhatsApp: <strong>+91 84213 08297</strong>
                  </span>
                </div>

                {bookingResult && !bookingResult.success && (
                  <div className={styles.formError}>{bookingResult.message}</div>
                )}

                <button
                  id="confirm-booking-btn"
                  className={`btn btn-primary btn-lg w-full ${styles.submitBtn}`}
                  onClick={handleStep2Submit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles.loadingSpinner}>Confirming Booking…</span>
                  ) : (
                    `🔒 Confirm Booking — ₹${(trek.price * slots).toLocaleString('en-IN')}`
                  )}
                </button>

                <p className={styles.secureNote}>
                  🔒 Your information is encrypted and secure. Seat will be reserved instantly upon confirmation.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirmation ─────────────────────────────────────── */}
          {step === 3 && bookingResult?.success && (
            <div className={styles.successPanel}>
              <div className={styles.successIcon}>🎉</div>
              <h2>Booking Confirmed!</h2>
              <p>
                You're all set, <strong>{form.name}</strong>! Your adventure on{' '}
                <strong>{trek.name}</strong> is locked in.
              </p>

              <div className={styles.successDetails}>
                {[
                  { label: 'Booking ID', value: bookingResult.bookingId ?? '—' },
                  { label: 'Trek', value: trek.name },
                  { label: 'Date', value: trek.dateRange },
                  { label: 'Duration', value: trek.duration },
                  { label: 'Slots Booked', value: `${slots} Person${slots > 1 ? 's' : ''}` },
                  { label: 'Amount Paid', value: `₹${(bookingResult.totalAmount || trek.price * slots).toLocaleString('en-IN')}` },
                  { label: 'Trekker', value: form.name },
                  { label: 'Contact', value: form.phone },
                ].map(({ label, value }) => (
                  <div key={label} className={styles.successRow}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.successNote}>
                📱 Share your UPI payment screenshot to{' '}
                <strong>hello@weekendriders.in</strong> or WhatsApp{' '}
                <strong>+91 84213 08297</strong> to finalise your booking.
              </div>

              <div className={styles.successActions}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => router.push('/')}
                >
                  ← Explore More Treks
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column: Booking Summary (sticky) ────────────────────── */}
        <div className={styles.summaryCol}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>📋 Booking Summary</h3>
            <div className={styles.summaryRows}>
              {[
                { label: 'Trek', value: trek.name },
                { label: 'Date', value: trek.dateRange },
                { label: 'Duration', value: trek.duration },
                { label: 'Difficulty', value: trek.difficulty },
                { label: 'Region', value: trek.region },
              ].map(({ label, value }) => (
                <div key={label} className={styles.summaryRow}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
              <div className={styles.summaryRow}>
                <span>Seats Left</span>
                <strong style={{ color: trek.seats <= 5 ? '#e36820' : '#2d7a3f' }}>
                  {trek.seats} available
                </strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Slots Selected</span>
                <strong>{slots}</strong>
              </div>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total Amount</span>
              <span className={styles.summaryAmount}>₹{(trek.price * slots).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {step === 1 && form.name && (
            <div className={styles.trekkerPreview}>
              <h4 style={{ fontFamily: 'Noto Serif', fontSize: '0.95rem', color: '#1B2E20', marginBottom: '12px' }}>
                👤 Trekker Preview
              </h4>
              {form.name && <p style={{ margin: '4px 0', fontSize: '0.875rem' }}><strong>Name:</strong> {form.name}</p>}
              {form.email && <p style={{ margin: '4px 0', fontSize: '0.875rem' }}><strong>Email:</strong> {form.email}</p>}
              {form.phone && <p style={{ margin: '4px 0', fontSize: '0.875rem' }}><strong>Phone:</strong> {form.phone}</p>}
            </div>
          )}

          <div className={styles.helpCard}>
            <strong>Need Help?</strong>
            <a href="tel:+918421308297" className={styles.helpLink}>📞 Call: +91 84213 08297</a>
            <a href="mailto:hello@weekendriders.in" className={styles.helpLink}>✉ hello@weekendriders.in</a>
            <a href="https://wa.me/918421308297" className={styles.helpLink}>💬 WhatsApp Us</a>
          </div>

          <div className={styles.inclusionsMini}>
            <h4 style={{ fontFamily: 'Noto Serif', fontSize: '0.9rem', color: '#1B2E20', marginBottom: '10px' }}>
              ✅ What's Included
            </h4>
            {trek.inclusions.map(({ icon, label }) => (
              <div key={label} className={styles.inclusionRow}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '68px', color: '#434843', fontSize: '1rem' }}>
        Loading checkout…
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
