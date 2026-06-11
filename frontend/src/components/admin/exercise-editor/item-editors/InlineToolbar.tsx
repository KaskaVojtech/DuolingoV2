'use client';

interface InlineToolbarProps {
  onInsert: (type: 'input' | 'select' | 'select_between' | 'drag_target') => void;
  hasDragSource: boolean;
}

export function InlineToolbar({ onInsert, hasDragSource }: InlineToolbarProps) {
  return (
    <div className="flex items-center gap-admin-sm mb-2 flex-wrap">
      <span className="text-admin-xs text-admin-text-muted">Vložit:</span>
      <button
        onClick={() => onInsert('input')}
        className="px-2 py-0.5 text-admin-xs rounded border border-block-exercise-border text-block-exercise-primary bg-block-exercise-bg hover:opacity-80 transition-opacity"
      >
        + Input
      </button>
      <button
        onClick={() => onInsert('select')}
        className="px-2 py-0.5 text-admin-xs rounded border text-[#2db8b8] hover:opacity-80 transition-opacity"
        style={{ borderColor: 'rgba(45,184,184,0.3)', background: 'rgba(45,184,184,0.12)' }}
      >
        + Select
      </button>
      <button
        onClick={() => onInsert('select_between')}
        className="px-2 py-0.5 text-admin-xs rounded border hover:opacity-80 transition-opacity"
        style={{ color: '#b464c8', borderColor: 'rgba(180,100,200,0.3)', background: 'rgba(180,100,200,0.12)' }}
      >
        + Select between
      </button>
      {hasDragSource && (
        <button
          onClick={() => onInsert('drag_target')}
          className="px-2 py-0.5 text-admin-xs rounded border hover:opacity-80 transition-opacity"
          style={{ color: '#f09632', borderColor: 'rgba(240,150,50,0.3)', background: 'rgba(240,150,50,0.12)', borderStyle: 'dashed' }}
        >
          + Drag target
        </button>
      )}
    </div>
  );
}
