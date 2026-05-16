'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trek, useTrekStore } from '@/store/trekStore';
import styles from './TrekCard.module.css';

interface Props {
  trek: Trek;
  compact?: boolean;
}

const difficultyClass: Record<Trek['difficulty'], string> = {
  Easy: 'chip chip-easy',
  Moderate: 'chip chip-moderate',
  Hard: 'chip chip-hard',
};

export default function TrekCard({ trek, compact = false }: Props) {
  const router = useRouter();
  const { selectedTrekId, selectTrek } = useTrekStore();
  const isSelected = selectedTrekId === trek.id;
  const isSoldOut = trek.seats <= 0;
  const seatsLow = trek.seats > 0 && trek.seats <= 5;

  const handleSelect = () => {
    if (isSoldOut) return;
    selectTrek(isSelected ? null : trek.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/trek/${trek.id}`);
  };

  return (
    <div
      id={`trek-card-${trek.id}`}
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${isSoldOut ? styles.soldOut : ''}`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
      aria-pressed={isSelected}
      aria-label={`Select ${trek.name} trek`}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        <Image
          src={trek.image}
          alt={trek.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className={styles.image}
          priority={false}
        />
        {/* Glassmorphic overlay */}
        <div className={styles.overlay}>
          <div className={styles.overlayTop}>
            <span className={difficultyClass[trek.difficulty]}>{trek.difficulty}</span>
            {isSoldOut && <span className="chip chip-sold-out">Sold Out</span>}
            {seatsLow && !isSoldOut && (
              <span className={`chip ${styles.chipUrgent}`}>🔥 {trek.seats} left</span>
            )}
          </div>
          <div className={styles.overlayBottom}>
            <span className={styles.overlayName}>{trek.name}</span>
            <span className={styles.overlayRegion}>{trek.region}</span>
          </div>
        </div>
        {/* Selected ring */}
        {isSelected && <div className={styles.selectedRing} />}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.tagline}>{trek.tagline}</p>

        {/* Meta row */}
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>📅</span>
            <span>{trek.date}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>⏱</span>
            <span>{trek.duration}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🏔</span>
            <span>{trek.altitude}</span>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          {trek.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        {/* Footer: price + seats + actions */}
        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>₹{trek.price.toLocaleString('en-IN')}</span>
            <span className={styles.perPerson}>/ person</span>
          </div>
          <div className={styles.seats}>
            {isSoldOut ? (
              <span className={styles.seatsNone}>Sold Out</span>
            ) : (
              <span className={seatsLow ? styles.seatsLow : styles.seatsOk}>
                {trek.seats} seats
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button
            className={`btn btn-secondary btn-sm ${styles.detailBtn}`}
            onClick={handleViewDetails}
            id={`view-details-${trek.id}`}
          >
            View Details
          </button>
          <button
            className={`btn btn-primary btn-sm ${styles.selectBtn} ${isSelected ? styles.selectBtnActive : ''}`}
            onClick={(e) => { e.stopPropagation(); handleSelect(); }}
            disabled={isSoldOut}
            id={`select-trek-${trek.id}`}
          >
            {isSelected ? '✓ Selected' : 'Select Trek'}
          </button>
        </div>
      </div>
    </div>
  );
}
