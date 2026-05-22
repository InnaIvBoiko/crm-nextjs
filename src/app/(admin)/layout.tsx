import React from 'react';
import Sidebar from '../components/sidebar';

// Admin pages read mutable data through the app's own API route handlers,
// so they must render per-request rather than be statically prerendered at
// build time (when no server is running to answer the fetch).
export const dynamic = 'force-dynamic';

export interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Sidebar />
      <div className="ml-60">{children}</div>
    </>
  );
}
