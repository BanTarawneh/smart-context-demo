import { Link } from 'wouter';
import { useDemoReset } from '../DemoContext';

type BrandLogoProps = {
  variant?: 'wordmark' | 'mark' | 'full';
  className?: string;
  invert?: boolean;
  testId?: string;
  linkClassName?: string;
  onClick?: () => void;
};

export function BrandLogo({
  variant = 'wordmark',
  className = '',
  invert = false,
  testId = 'link-brand-home',
  linkClassName = '',
  onClick,
}: BrandLogoProps) {
  const basePath = import.meta.env.BASE_URL;
  const resetDemo = useDemoReset();

  return (
    <Link
      href="/"
      onClick={() => {
        resetDemo();
        onClick?.();
      }}
      aria-label="Smart Context home"
      data-testid={testId}
      className={`inline-flex cursor-pointer rounded-md transition-opacity duration-200 hover:opacity-[0.85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sc-cyan focus-visible:ring-offset-2 ${invert ? 'focus-visible:ring-offset-sc-navy' : 'focus-visible:ring-offset-white'} ${linkClassName}`}
    >
      {variant === 'full' ? (
        <img
          src={`${basePath}brand/smart-context-logo.png`}
          alt=""
          aria-hidden="true"
          className={`object-contain ${className}`}
        />
      ) : (
        <span className={`flex items-center gap-2.5 ${className}`}>
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
        </span>
      )}
    </Link>
  );
}