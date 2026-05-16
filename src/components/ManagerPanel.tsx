'use client';

import { useState } from 'react';
import { useTrekStore, Trek, INITIAL_TREKS } from '@/store/trekStore';
import styles from './ManagerPanel.module.css';

type Tab = 'treks' | 'bookings' | 'analytics';

export default function ManagerPanel() {
  const {
    managerMode,
    managerAuthenticated,
    authenticateManager,
    lockManager,
    toggleManagerMode,
    treks,
    bookings,
    updateTrekField,
    addSeats,
    resetTrekToDefault,
  } = useTrekStore();

  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, Partial<Trek>>>({});
  const [activeTab, setActiveTab] = useState<Tab>('treks');
  const [toast, setToast] = useState('');

  if (!managerMode) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const handleAuth = () => {
    const ok = authenticateManager(pin);
    if (!ok) {
      setPinError('Incorrect PIN. Hint: admin123');
      setTimeout(() => setPinError(''), 2500);
    }
    setPin('');
  };

  const getEdit = (id: string) => editValues[id] ?? {};
  const setEdit = (id: string, field: string, value: string | number) =>
    setEditValues((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const applyEdits = (trek: Trek) => {
    const edits = getEdit(trek.id);
    const fields: (keyof Trek)[] = ['price', 'seats', 'date', 'dateRange', 'duration', 'altitude', 'distance', 'tagline', 'difficulty'];
    fields.forEach((f) => {
      if (edits[f] !== undefined) {
        const val = (f === 'price' || f === 'seats') ? Number(edits[f]) : edits[f];
        updateTrekField(trek.id, f, val as Trek[keyof Trek]);
      }
    });
    setEditValues((prev) => { const n = { ...prev }; delete n[trek.id]; return n; });
    showToast(`✅ ${trek.name} updated successfully`);
  };

  const handleReset = (trek: Trek) => {
    resetTrekToDefault(trek.id);
    setEditValues((prev) => { const n = { ...prev }; delete n[trek.id]; return n; });
    showToast(`↩ ${trek.name} reset to defaults`);
  };

  // Analytics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalSeatsBooked = treks.reduce((s, t) => s + (t.maxSeats - t.seats), 0);
  const totalCapacity = treks.reduce((s, t) => s + t.maxSeats, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalSeatsBooked / totalCapacity) * 100) : 0;

  // ─── Auth screen ─────────────────────────────────────────────────────────
  if (!managerAuthenticated) {
    return (
      <div className={styles.overlay} id="manager-auth-overlay">
        <div className={styles.authBox}>
          <div className={styles.authIcon}>⚙️</div>
          <h3>Manager Mode</h3>
          <p>Enter your admin PIN to access the live data management panel.</p>
          <div className={styles.pinRow}>
            <input
              id="manager-pin-input"
              type="password"
              className="input-field"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              autoFocus
              maxLength={20}
            />
          </div>
          {pinError && <p className={styles.pinError}>{pinError}</p>}
          <div className={styles.authBtns}>
            <button className="btn btn-primary w-full" onClick={handleAuth} id="manager-auth-submit">
              Unlock Panel
            </button>
            <button className="btn btn-secondary btn-sm" onClick={toggleManagerMode}>
              Cancel
            </button>
          </div>
          <p className={styles.hint}>Hint: admin123</p>
        </div>
      </div>
    );
  }

  // ─── Main panel ──────────────────────────────────────────────────────────
  return (
    <>
      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.panel} id="manager-panel">
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            <span className={styles.panelTitleIcon}>⚙️</span>
            <div>
              <strong>Manager Mode</strong>
              <small>Live editor — changes persist across sessions</small>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={lockManager} id="manager-close" title="Lock & Exit">✕</button>
        </div>

        {/* Stats row */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{bookings.length}</span>
            <span className={styles.statLabel}>Bookings</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>₹{(totalRevenue / 1000).toFixed(1)}k</span>
            <span className={styles.statLabel}>Revenue</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{overallOccupancy}%</span>
            <span className={styles.statLabel}>Occupancy</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{totalSeatsBooked}</span>
            <span className={styles.statLabel}>Seats Sold</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {(['treks', 'bookings', 'analytics'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t)}
              id={`manager-tab-${t}`}
            >
              {t === 'treks' ? '🏔 Treks' : t === 'bookings' ? '📋 Bookings' : '📊 Analytics'}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>

          {/* ── Tab: Treks ──────────────────────────────────────────────── */}
          {activeTab === 'treks' && (
            <div className={styles.trekList}>
              {treks.map((trek) => {
                const ed = getEdit(trek.id);
                const isExpanded = expandedId === trek.id;
                const occupancy = Math.round(((trek.maxSeats - trek.seats) / trek.maxSeats) * 100);
                const defaults = INITIAL_TREKS.find(t => t.id === trek.id);
                const hasChanges = defaults && (trek.price !== defaults.price || trek.seats !== defaults.seats || trek.date !== defaults.date);

                return (
                  <div key={trek.id} className={styles.trekItem} id={`manager-trek-${trek.id}`}>
                    {/* Header row */}
                    <button
                      className={styles.trekRow}
                      onClick={() => setExpandedId(isExpanded ? null : trek.id)}
                    >
                      <div className={styles.trekInfo}>
                        <span className={styles.trekName}>{trek.name}</span>
                        <span className={`chip chip-${trek.difficulty.toLowerCase()}`}>{trek.difficulty}</span>
                        {hasChanges && <span className={styles.editedBadge}>✏ Edited</span>}
                      </div>
                      <div className={styles.trekMeta}>
                        <span className={styles.trekPrice}>₹{trek.price.toLocaleString('en-IN')}</span>
                        <span className={trek.seats === 0 ? styles.noSeats : styles.hasSeats}>
                          {trek.seats}/{trek.maxSeats}
                        </span>
                        <span className={styles.chevron}>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </button>

                    {/* Occupancy bar */}
                    <div className={styles.occupancyBar}>
                      <div
                        className={styles.occupancyFill}
                        style={{
                          width: `${occupancy}%`,
                          background: occupancy > 90 ? '#ba1a1a' : occupancy > 70 ? '#F47D31' : '#2d7a3f'
                        }}
                      />
                    </div>
                    <span className={styles.occupancyLabel}>{occupancy}% booked — {trek.maxSeats - trek.seats} sold, {trek.seats} remaining</span>

                    {/* Expanded editor */}
                    {isExpanded && (
                      <div className={styles.editor}>
                        <div className={styles.editorGrid}>
                          {/* Price */}
                          <div className={styles.editorField}>
                            <label htmlFor={`price-${trek.id}`}>💰 Price (₹)</label>
                            <input
                              id={`price-${trek.id}`}
                              type="number"
                              className="input-field"
                              value={ed.price ?? trek.price}
                              onChange={(e) => setEdit(trek.id, 'price', e.target.value)}
                              min={0}
                            />
                          </div>
                          {/* Available Seats */}
                          <div className={styles.editorField}>
                            <label htmlFor={`seats-${trek.id}`}>💺 Available Seats</label>
                            <input
                              id={`seats-${trek.id}`}
                              type="number"
                              className="input-field"
                              value={ed.seats ?? trek.seats}
                              onChange={(e) => setEdit(trek.id, 'seats', e.target.value)}
                              min={0}
                              max={trek.maxSeats}
                            />
                          </div>
                          {/* Date */}
                          <div className={styles.editorField}>
                            <label htmlFor={`date-${trek.id}`}>📅 Next Date</label>
                            <input
                              id={`date-${trek.id}`}
                              type="text"
                              className="input-field"
                              value={ed.date ?? trek.date}
                              onChange={(e) => setEdit(trek.id, 'date', e.target.value)}
                              placeholder="e.g. Dec 15, 2025"
                            />
                          </div>
                          {/* Date Range */}
                          <div className={styles.editorField}>
                            <label htmlFor={`daterange-${trek.id}`}>📅 Date Range</label>
                            <input
                              id={`daterange-${trek.id}`}
                              type="text"
                              className="input-field"
                              value={ed.dateRange ?? trek.dateRange}
                              onChange={(e) => setEdit(trek.id, 'dateRange', e.target.value)}
                              placeholder="e.g. Dec 15 – Dec 16, 2025"
                            />
                          </div>
                          {/* Duration */}
                          <div className={styles.editorField}>
                            <label htmlFor={`duration-${trek.id}`}>⏱ Duration</label>
                            <input
                              id={`duration-${trek.id}`}
                              type="text"
                              className="input-field"
                              value={ed.duration ?? trek.duration}
                              onChange={(e) => setEdit(trek.id, 'duration', e.target.value)}
                              placeholder="e.g. 2 Days / 1 Night"
                            />
                          </div>
                          {/* Altitude */}
                          <div className={styles.editorField}>
                            <label htmlFor={`altitude-${trek.id}`}>🏔 Altitude</label>
                            <input
                              id={`altitude-${trek.id}`}
                              type="text"
                              className="input-field"
                              value={ed.altitude ?? trek.altitude}
                              onChange={(e) => setEdit(trek.id, 'altitude', e.target.value)}
                              placeholder="e.g. 1,429 m"
                            />
                          </div>
                          {/* Distance */}
                          <div className={styles.editorField}>
                            <label htmlFor={`distance-${trek.id}`}>📏 Distance</label>
                            <input
                              id={`distance-${trek.id}`}
                              type="text"
                              className="input-field"
                              value={ed.distance ?? trek.distance}
                              onChange={(e) => setEdit(trek.id, 'distance', e.target.value)}
                              placeholder="e.g. 14 km"
                            />
                          </div>
                          {/* Difficulty */}
                          <div className={styles.editorField}>
                            <label htmlFor={`difficulty-${trek.id}`}>⚡ Difficulty</label>
                            <select
                              id={`difficulty-${trek.id}`}
                              className="input-field"
                              value={(ed.difficulty ?? trek.difficulty) as string}
                              onChange={(e) => setEdit(trek.id, 'difficulty', e.target.value)}
                            >
                              <option value="Easy">Easy</option>
                              <option value="Moderate">Moderate</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </div>

                        {/* Tagline — full width */}
                        <div className={styles.editorField} style={{ marginTop: '12px' }}>
                          <label htmlFor={`tagline-${trek.id}`}>✍ Tagline</label>
                          <input
                            id={`tagline-${trek.id}`}
                            type="text"
                            className="input-field"
                            value={ed.tagline ?? trek.tagline}
                            onChange={(e) => setEdit(trek.id, 'tagline', e.target.value)}
                            placeholder="Short catchy tagline"
                          />
                        </div>

                        <div className={styles.editorActions}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => applyEdits(trek)}
                            id={`save-trek-${trek.id}`}
                          >
                            ✓ Apply Changes
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => { addSeats(trek.id, 5); showToast(`+5 seats added to ${trek.name}`); }}
                          >
                            + Add 5 Seats
                          </button>
                          {hasChanges && (
                            <button
                              className={styles.resetBtn}
                              onClick={() => handleReset(trek)}
                            >
                              ↩ Reset Defaults
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Tab: Bookings ────────────────────────────────────────────── */}
          {activeTab === 'bookings' && (
            <div className={styles.bookingsList}>
              {bookings.length === 0 ? (
                <div className={styles.emptyState}>
                  <span>📋</span>
                  <p>No bookings yet. They will appear here as trekkers book.</p>
                </div>
              ) : (
                <>
                  <div className={styles.bookingsHeader}>
                    <span className={styles.bookingsCount}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
                    <span className={styles.bookingsRevenue}>Total: ₹{totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  {[...bookings].reverse().map((b) => (
                    <div key={b.id} className={styles.bookingCard} id={`booking-${b.id}`}>
                      <div className={styles.bookingTop}>
                        <div>
                          <span className={styles.bookingName}>{b.name}</span>
                          <span className={styles.bookingId}>{b.id}</span>
                        </div>
                        <span className={styles.bookingAmount}>₹{b.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className={styles.bookingMeta}>
                        <span>🏔 {b.trekName}</span>
                        <span>📅 {b.date}</span>
                        <span>📧 {b.email}</span>
                        <span>📱 {b.phone}</span>
                      </div>
                      <div className={styles.bookingFooter}>
                        <span className={styles.bookingTime}>
                          Booked: {new Date(b.bookedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        {b.paymentRef && <span className={styles.bookingRef}>Ref: {b.paymentRef}</span>}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ── Tab: Analytics ───────────────────────────────────────────── */}
          {activeTab === 'analytics' && (
            <div className={styles.analytics}>
              <h4 className={styles.sectionTitle}>Trek Performance</h4>
              {treks.map((trek) => {
                const occupancy = Math.round(((trek.maxSeats - trek.seats) / trek.maxSeats) * 100);
                const trekBookings = bookings.filter((b) => b.trekId === trek.id);
                const trekRevenue = trekBookings.reduce((s, b) => s + b.amount, 0);
                return (
                  <div key={trek.id} className={styles.analyticsRow}>
                    <div className={styles.analyticsInfo}>
                      <span className={styles.analyticsName}>{trek.name}</span>
                      <span className={styles.analyticsStats}>
                        {trekBookings.length} bookings · ₹{trekRevenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className={styles.analyticsBarWrap}>
                      <div
                        className={styles.analyticsBar}
                        style={{
                          width: `${occupancy}%`,
                          background: occupancy > 90 ? '#ba1a1a' : occupancy > 70 ? '#F47D31' : '#2d7a3f'
                        }}
                      />
                      <span className={styles.analyticsPercent}>{occupancy}%</span>
                    </div>
                    <div className={styles.analyticsSeats}>
                      <span style={{ color: '#2d7a3f' }}>{trek.maxSeats - trek.seats} sold</span>
                      <span style={{ color: '#737872' }}>/</span>
                      <span style={{ color: '#737872' }}>{trek.maxSeats} cap</span>
                    </div>
                  </div>
                );
              })}

              <div className={styles.analyticsSummary}>
                <div className={styles.analyticsSummaryRow}>
                  <span>Total Revenue</span>
                  <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong>
                </div>
                <div className={styles.analyticsSummaryRow}>
                  <span>Avg. Booking Value</span>
                  <strong>
                    ₹{bookings.length > 0
                      ? Math.round(totalRevenue / bookings.length).toLocaleString('en-IN')
                      : 0}
                  </strong>
                </div>
                <div className={styles.analyticsSummaryRow}>
                  <span>Overall Occupancy</span>
                  <strong>{overallOccupancy}%</strong>
                </div>
                <div className={styles.analyticsSummaryRow}>
                  <span>Active Treks</span>
                  <strong>{treks.filter(t => t.seats > 0).length} / {treks.length}</strong>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
