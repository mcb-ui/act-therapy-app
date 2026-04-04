import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(31,137,150,0.08),_transparent_40%),linear-gradient(180deg,#fcfafb_0%,#f5f2f4_100%)] px-4">
      <div className="max-w-lg rounded-[2rem] border border-brand-pink/35 bg-white/92 p-10 text-center shadow-2xl backdrop-blur">
        <p className="mb-3 font-subheader text-sm uppercase tracking-[0.24em] text-electric-blue">
          404
        </p>
        <h1 className="mb-4 font-header text-4xl text-midnight-purple">Page Not Found</h1>
        <p className="mb-8 font-body text-gray-600">
          The page you requested does not exist or may have moved. Head back to your dashboard to
          continue your ACT practice.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          Return Home
        </Link>
      </div>
    </div>
  );
}
