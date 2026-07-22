import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ContactPayload = {
  email: string;
  message: string;
  name: string;
  subject: string;
};

function isContactPayload(value: unknown): value is ContactPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return ["email", "message", "name", "subject"].every((key) => typeof candidate[key] === "string");
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!isContactPayload(payload)) {
    return NextResponse.json({ error: "Invalid contact payload." }, { status: 400 });
  }

  const serverClient = await getSupabaseServerClient();
  const dbClient = getSupabaseAdminClient() ?? serverClient;

  if (!dbClient) {
    return NextResponse.json(
      { error: "Supabase is not configured yet. Add your environment values first." },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = serverClient ? await serverClient.auth.getUser() : { data: { user: null } };

  const { error } = await dbClient.from("contact_messages").insert({
    email: payload.email,
    message: payload.message,
    name: payload.name,
    subject: payload.subject,
    user_id: user?.id ?? null,
  });

  if (error) {
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
