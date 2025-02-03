import { MotionWrapper } from "./motion-wrapper";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  /**
   * If true, removes the default container padding
   * Useful for full-width sections like hero banners
   */
  fullWidth?: boolean;
}

export function PageLayout({
  children,
  className = "",
  fullWidth = false,
}: PageLayoutProps) {
  return (
    <MotionWrapper>
      <main
        className={`flex min-h-screen flex-col w-full max-w-[640px] space-y-4 mx-auto ${
          fullWidth ? "" : "container"
        } ${className}`}
      >
        {children}
      </main>
    </MotionWrapper>
  );
}
