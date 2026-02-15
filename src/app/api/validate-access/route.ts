import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 1. Get variables inside the function
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 2. Build-time safety guard
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Supabase variables are missing!");
    return NextResponse.json(
      { error: "Configuration missing" },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // 3. Robust JSON parsing
    const body = await req.json().catch(() => ({}));
    const accessId = body?.accessId;

    if (!accessId) {
      return NextResponse.json({ error: "Access ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("groups")
      .select("id, group_name")
      .eq("access_id", accessId.toString().toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 404 });
    }

    return NextResponse.json({ success: true, groupId: data.id });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}


