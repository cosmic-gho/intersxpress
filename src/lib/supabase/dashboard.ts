import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const shipmentStatusOptions = [
  "placed",
  "confirmed",
  "intransit",
  "nearby",
  "out_for_delivery",
  "delivered",
] as const;

export type ShipmentStatusOption = (typeof shipmentStatusOptions)[number];

export type AdminShipment = {
  comment: string;
  currentLat: number | null;
  currentLocation: string;
  currentLng: number | null;
  destination: string;
  destinationLat: number | null;
  destinationLng: number | null;
  dispatchDate: string | null;
  expectedDate: string | null;
  id: string;
  packageName: string;
  paymentMethod: string;
  pickup: string;
  price: string;
  receiverFullName: string;
  senderFullName: string;
  status: ShipmentStatusOption;
  trackingId: string;
  type: string;
  updatedAt: string;
};

export type ContactMessageStatus = "new" | "read" | "archived";

export type AdminContactMessage = {
  createdAt: string;
  email: string;
  id: string;
  message: string;
  name: string;
  status: ContactMessageStatus;
  subject: string;
};

function normalizeShipmentStatus(status: string): ShipmentStatusOption {
  return shipmentStatusOptions.includes(status as ShipmentStatusOption)
    ? (status as ShipmentStatusOption)
    : "placed";
}

function normalizeContactStatus(status: string): ContactMessageStatus {
  return status === "read" || status === "archived" ? status : "new";
}

export async function getAdminShipments() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("shipments")
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
    .order("updated_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load admin shipments.", error);
    return [];
  }

  return data.map((shipment) => ({
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
  })) satisfies AdminShipment[];
}

export async function getAdminContactMessages() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .select(`
      id,
      name,
      email,
      subject,
      message,
      status,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to load admin contact messages.", error);
    return [];
  }

  return data.map((message) => ({
    createdAt: message.created_at,
    email: message.email,
    id: message.id,
    message: message.message,
    name: message.name,
    status: normalizeContactStatus(message.status),
    subject: message.subject,
  })) satisfies AdminContactMessage[];
}
