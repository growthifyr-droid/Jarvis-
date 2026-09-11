import React from 'react';

interface PageContainerProps {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  id,
  icon,
  title,
  subtitle,
  badge,
  actions,
  children,
  maxWidthClass = 'max-w-6xl',
}) => {
  return (
    <div
      id={id}
      className="flex-1 w-full overflow-y-auto bg-[#08090b] text-[#f0f3f6] select-none"
    >
      <div className={`${maxWidthClass} mx-auto px-6 md:px-10 py-8 flex flex-col gap-6`}>
        {/* Consistent Page Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c222a] pb-6">
          <div className="flex items-center gap-3.5">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-[#0f1216] border border-[#1c222a] flex items-center justify-center flex-shrink-0 text-[#00f2a1]">
                {icon}
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="font-mono text-base font-bold text-[#f0f3f6] tracking-wider uppercase">
                  {title}
                </h1>
                {badge}
              </div>
              <p className="font-mono text-xs text-[#8c96a5] mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>

        {/* Page Main Content */}
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
};
