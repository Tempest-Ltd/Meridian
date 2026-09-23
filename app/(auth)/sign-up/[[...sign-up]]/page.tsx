export const dynamic = "force-dynamic";

import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return <SignUp />;
}