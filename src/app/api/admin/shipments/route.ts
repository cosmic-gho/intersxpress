import { NextResponse } from "next/server";

import { getAdminIdentity } from "@/lib/supabase/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  shipmentStatusOptions,
  type AdminShipment,
  type ShipmentStatusOption,
} from "@/lib/supabase/dashboard";
import { generateTrackingId, normalizeTrackingId } from "@/lib/tracking-id";

type CreateShipmentPayload = {
  comment: string;
  currentLat: string;
  currentLocation: string;
  currentLng: string;
  destination: string;
  destinationLat: string;
  destinationLng: string;
  dispatchDate: string;
  eventDetails: string;
  eventLabel: string;
  expectedDate: string;
  height: string;
  length: string;
  packageName: string;
  paymentMethod: string;
  pickup: string;
  price: string;
  receiverCountry: string;
  receiverEmail: string;
  receiverFullName: string;
  receiverPhone: string;
  senderCountry: string;
  senderEmail: string;
  senderFullName: string;
  senderPhone: string;
  status: string;
  trackingId: string;
  type: string;
  weight: string;
  width: string;
};

function isCreateShipmentPayload(value: unknown): value is CreateShipmentPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const requiredKeys: Array<keyof CreateShipmentPayload> = [
    "comment",
    "currentLat",
    "currentLocation",
    "currentLng",
    "destination",
    "destinationLat",
    "destinationLng",
    "dispatchDate",
    "eventDetails",
    "eventLabel",
    "expectedDate",
    "height",
    "length",
    "packageName",
    "paymentMethod",
    "pickup",
    "price",
    "receiverCountry",
    "receiverEmail",
    "receiverFullName",
    "receiverPhone",
    "senderCountry",
    "senderEmail",
    "senderFullName",
    "senderPhone",
    "status",
    "trackingId",
    "type",
    "weight",
    "width",
  ];

  return requiredKeys.every((key) => typeof candidate[key] === "string");
}

function normalizeShipmentStatus(status: string): ShipmentStatusOption {
  return shipmentStatusOptions.includes(status as ShipmentStatusOption)
    ? (status as ShipmentStatusOption)
    : "placed";
}

function toIsoString(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
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
    status: normalizeShipmentStatus(shipment.status),
    trackingId: shipment.tracking_id,
    type: shipment.type,
    updatedAt: shipment.updated_at,
  } satisfies AdminShipment;
}

export async function POST(request: Request) {
  const admin = await getAdminIdentity();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);

  if (!isCreateShipmentPayload(payload)) {
    return NextResponse.json({ error: "Invalid shipment payload." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client is not configured." }, { status: 503 });
  }

  const trackingId = payload.trackingId.trim()
    ? normalizeTrackingId(payload.trackingId)
    : generateTrackingId();
  const status = normalizeShipmentStatus(payload.status);

  const { data: createdShipment, error: shipmentError } = await supabase
    .from("shipments")
    .insert({
      comment: payload.comment,
      current_lat: toNullableNumber(payload.currentLat),
      current_location: payload.currentLocation,
      current_lng: toNullableNumber(payload.currentLng),
      destination: payload.destination,
      destination_lat: toNullableNumber(payload.destinationLat),
      destination_lng: toNullableNumber(payload.destinationLng),
      dispatch_date: toIsoString(payload.dispatchDate),
      expected_date: toIsoString(payload.expectedDate),
      height: payload.height,
      length: payload.length,
      package_name: payload.packageName,
      payment_method: payload.paymentMethod,
      pickup: payload.pickup,
      price: payload.price,
      receiver_country: payload.receiverCountry,
      receiver_email: payload.receiverEmail,
      receiver_full_name: payload.receiverFullName,
      receiver_phone: payload.receiverPhone,
      sender_country: payload.senderCountry,
      sender_email: payload.senderEmail,
      sender_full_name: payload.senderFullName,
      sender_phone: payload.senderPhone,
      status,
      tracking_id: trackingId,
      type: payload.type,
      weight: payload.weight,
      width: payload.width,
    })
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

  if (shipmentError || !createdShipment) {
    return NextResponse.json({ error: "Unable to create shipment." }, { status: 500 });
  }

  const label = payload.eventLabel.trim() || "Shipment created by admin";

  const { error: eventError } = await supabase.from("tracking_events").insert({
    details: payload.eventDetails.trim() || `Created by ${admin.email ?? "admin"}`,
    event_time: new Date().toISOString(),
    label,
    location: payload.currentLocation.trim() || payload.pickup.trim() || null,
    shipment_id: createdShipment.id,
    status,
    tracking_id: trackingId,
  });

  if (eventError) {
    return NextResponse.json(
      { error: "Shipment created, but the initial tracking event could not be saved." },
      { status: 500 },
    );
  }

  return NextResponse.json({ shipment: mapShipment(createdShipment) }, { status: 201 });
}
