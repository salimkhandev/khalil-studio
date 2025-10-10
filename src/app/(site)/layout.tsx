import type { ReactNode } from "react";
import "../globals.css";

export default function SiteLayout({ children }: { children: ReactNode }) {
  // Only the root layout should render <html> and <body>.
  // Returning children directly ensures theme classes and base styles from the root apply.
  return <>{children}</>;
}


