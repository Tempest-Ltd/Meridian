import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 md:px-12">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          {children}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Meridian.{" "}
          <Link href="/#about" className="underline-offset-4 hover:underline">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/#about" className="underline-offset-4 hover:underline">
            Terms
          </Link>
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-[#1b2e24] lg:block">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative flex h-full flex-col justify-end p-12 text-[#fbfaf7]">
          <p className="eyebrow text-[#c9a227]">Meridian</p>
          <p className="mt-3 max-w-sm font-display text-3xl leading-tight">
            Better products.
            <br />
            A brighter you.
          </p>
          <span className="mt-4 block h-px w-10 bg-[#c9a227]" />
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Join thousands of customers who&apos;ve upgraded their everyday
            essentials.
          </p>
        </div>
      </div>
    </div>
  );
}