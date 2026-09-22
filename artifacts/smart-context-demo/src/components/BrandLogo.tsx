type BrandLogoProps = {
  variant?: 'wordmark' | 'mark' | 'full';
  className?: string;
  invert?: boolean;
};

export function BrandLogo({
  variant = 'wordmark',
  className = '',
  invert = false,
}: BrandLogoProps) {
  const basePath = import.meta.env.BASE_URL;

  if (variant === 'full') {
    return (
      <img
        src={`${basePath}brand/smart-context-logo.png`}
        alt="Smart Context — Turn information into action"
        className={`object-contain ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={`${basePath}brand/smart-context-mark.png`}
        alt=""
        aria-hidden="true"
        className="h-full max-h-9 w-auto object-contain"
      />
      {variant === 'wordmark' && (
        <span
          className={`whitespace-nowrap text-xl font-black tracking-tight ${
            invert ? 'text-white' : 'text-sc-navy'
          }`}
        >
          Smart Context
        </span>
      )}
    </div>
  );
}