import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { generateTrackingId } from "@/lib/tracking-id";

type QuotePayload = {
  comment: string;
  deliveryDate: string;
  destination: string;
  height: string;
  length: string;
  packageType: string;
  paymentMethod: string;
  pickup: string;
  pickupDate: string;
  receiverCountry: string;
  receiverEmail: string;
  receiverName: string;
  receiverPhone: string;
  senderCountry: string;
  senderEmail: string;
  senderName: string;
  senderPhone: string;
  weight: string;
  width: string;
};

function isQuotePayload(value: unknown): value is QuotePayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const requiredKeys: Array<keyof QuotePayload> = [
    "comment",
    "deliveryDate",
    "destination",
    "height",
    "length",
    "packageType",
    "paymentMethod",
    "pickup",
    "pickupDate",
    "receiverCountry",
    "receiverEmail",
    "receiverName",
    "receiverPhone",
    "senderCountry",
    "senderEmail",
    "senderName",
    "senderPhone",
    "weight",
    "width",
  ];

  return requiredKeys.every((key) => typeof candidate[key] === "string");
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!isQuotePayload(payload)) {
    return NextResponse.json({ error: "Invalid quote payload." }, { status: 400 });
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

  const trackingId = generateTrackingId();

  const { data: quote, error: quoteError } = await dbClient
    .from("quotes")
    .insert({
      comment: payload.comment,
      delivery_date: payload.deliveryDate,
      destination: payload.destination,
      height: payload.height,
      length: payload.length,
      package_type: payload.packageType,
      payment_method: payload.paymentMethod,
      pickup: payload.pickup,
      pickup_date: payload.pickupDate,
      receiver_country: payload.receiverCountry,
      receiver_email: payload.receiverEmail,
      receiver_name: payload.receiverName,
      receiver_phone: payload.receiverPhone,
      sender_country: payload.senderCountry,
      sender_email: payload.senderEmail,
      sender_name: payload.senderName,
      sender_phone: payload.senderPhone,
      status: "placed",
      tracking_id: trackingId,
      user_id: user?.id ?? null,
      weight: payload.weight,
      width: payload.width,
    })
    .select("id")
    .single();

  if (quoteError || !quote) {
    return NextResponse.json({ error: "Unable to save your quote request." }, { status: 500 });
  }

  const { data: shipment, error: shipmentError } = await dbClient
    .from("shipments")
    .insert({
      comment: payload.comment,
      current_location: payload.pickup,
      destination: payload.destination,
      dispatch_date: payload.pickupDate,
      expected_date: payload.deliveryDate,
      height: payload.height,
      length: payload.length,
      package_name: payload.packageType,
      payment_method: payload.paymentMethod,
      pickup: payload.pickup,
      price: "Pending",
      quote_request_id: quote.id,
      receiver_country: payload.receiverCountry,
      receiver_email: payload.receiverEmail,
      receiver_full_name: payload.receiverName,
      receiver_phone: payload.receiverPhone,
      sender_country: payload.senderCountry,
      sender_email: payload.senderEmail,
      sender_full_name: payload.senderName,
      sender_phone: payload.senderPhone,
      status: "placed",
      tracking_id: trackingId,
      type: payload.packageType,
      user_id: user?.id ?? null,
      weight: payload.weight,
      width: payload.width,
    })
    .select("id")
    .single();

  if (shipmentError || !shipment) {
    return NextResponse.json(
      { error: "Quote saved, but tracking could not be initialized." },
      { status: 500 },
    );
  }

  const { error: eventError } = await dbClient.from("tracking_events").insert({
    details: payload.comment || null,
    event_time: payload.pickupDate,
    label: "Quote request received",
    location: payload.pickup,
    shipment_id: shipment.id,
    status: "placed",
    tracking_id: trackingId,
  });

  if (eventError) {
    return NextResponse.json(
      { error: "Quote saved, but the initial tracking event could not be created." },
      { status: 500 },
    );
  }

  return NextResponse.json({ trackingId }, { status: 201 });
}
