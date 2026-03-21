import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    console.log('[API] POST /api/auth/logout - Request');
    await clearAuthCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] POST /api/auth/logout - Error:', error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
