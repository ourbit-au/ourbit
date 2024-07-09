import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();

  let { data, error } = await supabase.from("offers").select("*");

  const result = data;

  return NextResponse.json(result);
}
