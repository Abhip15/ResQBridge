import { useState, useEffect } from 'react';
import { formatConfidence, calculateDashOffset } from '../utils/formatters';

/**
 * CircularProgress — renders a circular gauge showing the confidence score.
 * Uses SVG for crisp rendering at any size.
 * Animates the fill arc on mount over 500ms.
 */
export default function CircularProgress({ score, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.round(score * 100);
  const targetOffset = calculateDashOffset(percentage, circumference);

  /* Start fully empty, then animate to target on mount */
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setDashOffset(targetOffset));
    return () => cancelAnimationFrame(frame);
  }, [targetOffset]);

  const getColor = () => {
    if (percentage >= 80) return 'var(--color-success)';
    if (percentage >= 60) return 'var(--color-warning)';
    return 'var(--color-critical)';
  };

  const getLabel = () => {
    if (percentage >= 80) return 'High';
    if (percentage >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div
      className="flex flex-col items-center gap-2"
      role="meter"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Analysis confidence score: ${percentage} percent, rated ${getLabel()}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle cx={size / 2} cy={size / 2} r={radius} className="circular-progress-track" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          className="circular-progress-fill"
          stroke={getColor()}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
        <text x="50%" y="45%" textAnchor="middle" dominantBaseline="central"
          className="font-data" fill={getColor()} fontSize="24" fontWeight="bold">
          {formatConfidence(score)}
        </text>
        <text x="50%" y="62%" textAnchor="middle" dominantBaseline="central"
          fill="var(--color-text-muted)" fontSize="11">
          confidence
        </text>
      </svg>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor() }} aria-hidden="true" />
        <span className="text-xs text-text-secondary font-medium">{getLabel()} Confidence</span>
      </div>
    </div>
  );
}
