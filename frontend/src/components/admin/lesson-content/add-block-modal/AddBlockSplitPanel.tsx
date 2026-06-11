'use client';

interface AddBlockSplitPanelProps {
  icon: string;
  title: string;
  titleColor: string;
  description: string;
  buttonLabel: string;
  buttonColor: string;
  panelClass: string;
  onClick: () => void;
}

export function AddBlockSplitPanel({ icon, title, titleColor, description, buttonLabel, buttonColor, panelClass, onClick }: AddBlockSplitPanelProps) {
  return (
    <div onClick={onClick} className={`add-block-modal__panel ${panelClass}`}>
      <i className={`ti ${icon} add-block-modal__icon`} style={{ color: titleColor }} aria-hidden="true" />
      <h3 className="text-admin-base font-semibold mb-1" style={{ color: titleColor }}>{title}</h3>
      <p className="text-admin-xs text-admin-text-muted mb-admin-md max-w-[180px]">{description}</p>
      <button
        className="px-admin-md py-2 text-admin-sm font-medium rounded-admin-sm border transition-colors"
        style={{ color: titleColor, borderColor: buttonColor }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
