'use client';

interface AddLessonSplitPanelProps {
  icon: string;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  isRight?: boolean;
}

export function AddLessonSplitPanel({ icon, title, description, buttonLabel, onClick, isRight }: AddLessonSplitPanelProps) {
  return (
    <div
      onClick={onClick}
      className={`add-lesson-modal__panel flex-1 flex flex-col items-center justify-center gap-admin-md p-admin-2xl cursor-pointer border-admin-border ${
        isRight ? 'border-l' : ''
      }`}
    >
      <i className={`ti ${icon} text-admin-text-muted`} style={{ fontSize: 32 }} aria-hidden="true" />
      <div className="text-center">
        <h3 className="text-admin-base font-semibold text-admin-text mb-1">{title}</h3>
        <p className="text-admin-xs text-admin-text-muted max-w-[200px]">{description}</p>
      </div>
      <button
        className="px-admin-md py-2 bg-admin-primary hover:bg-admin-primary-h text-white text-admin-sm font-medium rounded-admin-sm transition-colors"
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
