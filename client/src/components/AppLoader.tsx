interface AppLoaderProps {
  label?: string;
}

export default function AppLoader({ label = 'Loading...' }: AppLoaderProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="rounded-2xl border border-midnight-purple/10 bg-white/80 px-6 py-5 text-center shadow-lg backdrop-blur">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-midnight-purple/15 border-t-midnight-purple" />
        <p className="font-subheader text-sm uppercase tracking-[0.18em] text-midnight-purple">
          {label}
        </p>
      </div>
    </div>
  );
}
