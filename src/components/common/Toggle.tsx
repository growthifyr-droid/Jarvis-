import React from 'react';

interface ToggleProps {
  id?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({
  id,
  enabled,
  onChange,
  disabled = false,
  label,
  size = 'md',
}) => {
  const isSmall = size === 'sm';

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs font-mono text-[#8c96a5] select-none">
          {label}
        </span>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={`relative inline-flex flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#00f2a1]/40 ${
          isSmall ? 'w-8 h-4.5 p-0.5' : 'w-10 h-5 p-0.5'
        } ${
          enabled
            ? 'bg-[#00f2a1]/20 border border-[#00f2a1]/60'
            : 'bg-[#151920] border border-[#262e38]'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block transform rounded-full transition-transform duration-200 ${
            isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'
          } ${
            enabled
              ? isSmall
                ? 'translate-x-3.5 bg-[#00f2a1] shadow-[0_0_6px_rgba(0,242,161,0.5)]'
                : 'translate-x-5 bg-[#00f2a1] shadow-[0_0_6px_rgba(0,242,161,0.5)]'
              : 'translate-x-0 bg-[#5a6575]'
          }`}
        />
      </button>
      <span
        className={`font-mono text-[10px] font-bold tracking-wider ${
          enabled ? 'text-[#00f2a1]' : 'text-[#5a6575]'
        }`}
      >
        {enabled ? 'ON' : 'OFF'}
      </span>
    </div>
  );
};
