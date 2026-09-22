import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-5xl">Page not found.</h1>
      <p className="mt-4 max-w-prose text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#1b2e24] px-6 py-3 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
      >
        Back to home
      </Link>
    </div>
  );
}