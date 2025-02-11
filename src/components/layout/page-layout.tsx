import { MotionWrapper } from "./motion-wrapper";
import { NavBar } from "./nav-bar";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  /**
   * If true, removes the default container padding
   * Useful for full-width sections like hero banners
   */
  fullWidth?: boolean;
  hideNav?: boolean;
}

export function PageLayout({
  children,
  className = "",
  fullWidth = false,
  hideNav = false,
}: PageLayoutProps) {
  return (
    <MotionWrapper>
      <div className="min-h-screen bg-background">
        {!hideNav && <NavBar />}
        <main
          className={` space-y-4 mx-auto ${
            fullWidth ? "" : "container"
          } ${className}`}
        >
          {children}
        </main>
      </div>
    </MotionWrapper>
  );
}
