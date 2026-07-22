import { NextResponse } from "next/server";

import { getAdminIdentity } from "@/lib/supabase/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { type AdminContactMessage, type ContactMessageStatus } from "@/lib/supabase/dashboard";

type RouteContext = {
  params: Promise<{
    messageId: string;
  }>;
};

type UpdateContactMessagePayload = {
  status: string;
};

function isUpdateContactMessagePayload(value: unknown): value is UpdateContactMessagePayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.status === "string";
}

function normalizeContactStatus(status: string): ContactMessageStatus {
  return status === "read" || status === "archived" ? status : "new";
}

function mapContactMessage(message: {
  created_at: string;
  email: string;
  id: string;
  message: string;
  name: string;
  status: string;
  subject: string;
}) {
  return {
    createdAt: message.created_at,
    email: message.email,
    id: message.id,
    message: message.message,
    name: message.name,
    status: normalizeContactStatus(message.status),
    subject: message.subject,
  } satisfies AdminContactMessage;
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await getAdminIdentity();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);

  if (!isUpdateContactMessagePayload(payload)) {
    return NextResponse.json({ error: "Invalid contact message payload." }, { status: 400 });
  }

  const { messageId } = await context.params;
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client is not configured." }, { status: 503 });
  }

  const { data: updatedMessage, error } = await supabase
    .from("contact_messages")
    .update({
      status: normalizeContactStatus(payload.status),
    })
    .eq("id", messageId)
    .select(`
      id,
      name,
      email,
      subject,
      message,
      status,
      created_at
    `)
    .single();

  if (error || !updatedMessage) {
    return NextResponse.json({ error: "Unable to update this contact message." }, { status: 500 });
  }

  return NextResponse.json({ message: mapContactMessage(updatedMessage) });
}
