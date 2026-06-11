'use client';

interface PracticeUnavailableBadgeProps {
  reason: string;
}

export function PracticeUnavailableBadge({ reason }: PracticeUnavailableBadgeProps) {
  return (
    <span className="practice-unavailable-badge">
      <i className="ti ti-alert-triangle" />
      {reason}
    </span>
  );
}
