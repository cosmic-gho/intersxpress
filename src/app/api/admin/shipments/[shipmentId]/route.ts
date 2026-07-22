import { NextResponse } from "next/server";

import { getAdminIdentity } from "@/lib/supabase/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { type AdminShipment, shipmentStatusOptions, type ShipmentStatusOption } from "@/lib/supabase/dashboard";

type RouteContext = {
  params: Promise<{
    shipmentId: string;
  }>;
};

type UpdateShipmentPayload = {
  currentLat: string;
  currentLocation: string;
  currentLng: string;
  destinationLat: string;
  destinationLng: string;
  eventDetails: string;
  eventLabel: string;
  expectedDate: string;
  price: string;
  status: string;
};

function isUpdateShipmentPayload(value: unknown): value is UpdateShipmentPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.currentLat === "string" &&
    typeof candidate.currentLocation === "string" &&
    typeof candidate.currentLng === "string" &&
    typeof candidate.destinationLat === "string" &&
    typeof candidate.destinationLng === "string" &&
    typeof candidate.eventDetails === "string" &&
    typeof candidate.eventLabel === "string" &&
    typeof candidate.expectedDate === "string" &&
    typeof candidate.price === "string" &&
    typeof candidate.status === "string"
  );
}

function toNullableNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsedNumber = Number(value);
  return Number.isFinite(parsedNumber) ? parsedNumber : null;
}

function mapShipment(shipment: {
  comment: string;
  current_lat: number | null;
  current_location: string;
  current_lng: number | null;
  destination: string;
  destination_lat: number | null;
  destination_lng: number | null;
  dispatch_date: string | null;
  expected_date: string | null;
  id: string;
  package_name: string;
  payment_method: string;
  pickup: string;
  price: string;
  receiver_full_name: string;
  sender_full_name: string;
  status: string;
  tracking_id: string;
  type: string;
  updated_at: string;
}) {
  const normalizedStatus = shipmentStatusOptions.includes(shipment.status as ShipmentStatusOption)
    ? (shipment.status as ShipmentStatusOption)
    : "placed";

  return {
    comment: shipment.comment,
    currentLat: shipment.current_lat,
    currentLocation: shipment.current_location,
    currentLng: shipment.current_lng,
    destination: shipment.destination,
    destinationLat: shipment.destination_lat,
    destinationLng: shipment.destination_lng,
    dispatchDate: shipment.dispatch_date,
    expectedDate: shipment.expected_date,
    id: shipment.id,
    packageName: shipment.package_name,
    paymentMethod: shipment.payment_method,
    pickup: shipment.pickup,
    price: shipment.price,
    receiverFullName: shipment.receiver_full_name,
    senderFullName: shipment.sender_full_name,
    status: normalizedStatus,
    trackingId: shipment.tracking_id,
    type: shipment.type,
    updatedAt: shipment.updated_at,
  } satisfies AdminShipment;
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await getAdminIdentity();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);

  if (!isUpdateShipmentPayload(payload)) {
    return NextResponse.json({ error: "Invalid shipment update payload." }, { status: 400 });
  }

  if (!shipmentStatusOptions.includes(payload.status as (typeof shipmentStatusOptions)[number])) {
    return NextResponse.json({ error: "Invalid shipment status." }, { status: 400 });
  }

  const { shipmentId } = await context.params;
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client is not configured." }, { status: 503 });
  }

  const parsedExpectedDate = payload.expectedDate ? new Date(payload.expectedDate) : null;
  const normalizedExpectedDate =
    parsedExpectedDate && !Number.isNaN(parsedExpectedDate.getTime())
      ? parsedExpectedDate.toISOString()
      : null;

  const { data: updatedShipment, error: updateError } = await supabase
    .from("shipments")
    .update({
      current_lat: toNullableNumber(payload.currentLat),
      current_location: payload.currentLocation,
      current_lng: toNullableNumber(payload.currentLng),
      destination_lat: toNullableNumber(payload.destinationLat),
      destination_lng: toNullableNumber(payload.destinationLng),
      expected_date: normalizedExpectedDate,
      price: payload.price,
      status: payload.status,
    })
    .eq("id", shipmentId)
    .select(`
      id,
      tracking_id,
      status,
      pickup,
      destination,
      current_location,
      current_lat,
      current_lng,
      destination_lat,
      destination_lng,
      type,
      price,
      payment_method,
      package_name,
      comment,
      dispatch_date,
      expected_date,
      sender_full_name,
      receiver_full_name,
      updated_at
    `)
    .single();

  if (updateError || !updatedShipment) {
    return NextResponse.json({ error: "Unable to update this shipment." }, { status: 500 });
  }

  if (payload.eventLabel.trim()) {
    const { error: eventError } = await supabase.from("tracking_events").insert({
      details: payload.eventDetails.trim() || null,
      event_time: new Date().toISOString(),
      label: payload.eventLabel.trim(),
      location: payload.currentLocation.trim() || null,
      shipment_id: shipmentId,
      status: payload.status,
      tracking_id: updatedShipment.tracking_id,
    });

    if (eventError) {
      return NextResponse.json(
        { error: "Shipment was updated, but the tracking event could not be saved." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ shipment: mapShipment(updatedShipment) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await getAdminIdentity();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { shipmentId } = await context.params;
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client is not configured." }, { status: 503 });
  }

  const { error } = await supabase.from("shipments").delete().eq("id", shipmentId);

  if (error) {
    return NextResponse.json({ error: "Unable to delete this shipment." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
