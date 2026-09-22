import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { uploadBuffer } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "INVALID_FORM" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "NO_FILE" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "FILE_TOO_LARGE", max: MAX_BYTES },
      { status: 413 }
    );
  }

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "INVALID_TYPE", allowed: ALLOWED },
      { status: 415 }
    );
  }

  const folder =
    (formData.get("folder") as string | null) ?? "meridian/products";

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadBuffer(buffer, folder);
    return NextResponse.json({ url, publicId });
  } catch (err) {
    console.error("[api/admin/upload]", err);
    return NextResponse.json({ error: "UPLOAD_FAILED" }, { status: 500 });
  }
}