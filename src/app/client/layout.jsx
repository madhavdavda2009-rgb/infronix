export const metadata = {
  title: 'Client Portal | InfronixWeb',
  description: 'Secure client workspace for project milestones, live staging preview, change requests, and deliverables.',
  robots: {
    index: false,
    follow: false
  }
};

export default function ClientPortalLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-violet-500 selection:text-white">
      {children}
    </div>
  );
}
