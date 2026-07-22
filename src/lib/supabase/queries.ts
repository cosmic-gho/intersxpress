import { getSupabaseServerClient } from "@/lib/supabase/server";

export type TrackingTimelineEvent = {
  details: string | null;
  eventTime: string;
  label: string;
  location: string | null;
  status: string;
};

export type TrackingPageRecord = {
  carrier: string;
  comment: string;
  currentLocation: string;
  destination: string;
  dispatchDate: string;
  events: TrackingTimelineEvent[];
  expectedDate: string;
  height: string;
  id: string;
  length: string;
  map: {
    destinationLat: number | null;
    destinationLng: number | null;
    lat: number | null;
    lng: number | null;
  };
  packageName: string;
  paymentMethod: string;
  pickup: string;
  price: string;
  receiver: {
    country: string;
    email: string;
    fullName: string;
    phone: string;
  };
  sender: {
    country: string;
    email: string;
    fullName: string;
    phone: string;
  };
  status: string;
  trackingId: string;
  type: string;
  weight: string;
  width: string;
};

export async function getSupabaseTrackingRecord(trackingId: string) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.rpc("get_tracking_details", {
    input_tracking_id: trackingId,
  });

  if (error) {
    console.error("Failed to load tracking details from Supabase.", error);
    return null;
  }

  if (!data || typeof data !== "object") {
    return null;
  }

  return data as TrackingPageRecord;
}
