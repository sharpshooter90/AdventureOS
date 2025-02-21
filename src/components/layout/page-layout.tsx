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
    <div className="min-h-screen bg-background">
      {!hideNav && <NavBar />}
      <main className={` ${fullWidth ? "" : ""} ${className}`}>{children}</main>
    </div>
  );
}
