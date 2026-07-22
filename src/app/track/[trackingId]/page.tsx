import { notFound } from "next/navigation";
import {
  CalendarClock,
  MapPin,
  Package,
  Printer,
  Truck,
  User,
  UserRoundSearch,
} from "lucide-react";

import { TrackingBarcode } from "@/components/tracking-barcode";
import { getTrackingRecord, type TrackingRecord, trackingSteps } from "@/lib/site-data";
import { getSupabaseTrackingRecord, type TrackingPageRecord } from "@/lib/supabase/queries";

type TrackingDetailsPageProps = {
  params: Promise<{
    trackingId: string;
  }>;
};

function statusIndex(status: string) {
  return trackingSteps.findIndex((step) => step.key === status);
}

function mapFallbackRecord(record: TrackingRecord): TrackingPageRecord {
  const currentStepIndex = Math.max(statusIndex(record.status), 0);

  return {
    carrier: "FEDEX",
    comment: record.comment,
    currentLocation: record.currentLocation,
    destination: record.destination,
    dispatchDate: record.dispatchDate,
    events: trackingSteps.slice(0, currentStepIndex + 1).map((step) => ({
      details: null,
      eventTime: record.dispatchDate,
      label: step.label,
      location: step.key === record.status ? record.currentLocation : record.pickup,
      status: step.key,
    })),
    expectedDate: record.expectedDate,
    height: record.height,
    id: String(record.id),
    length: record.length,
    map: record.map,
    packageName: record.packageName,
    paymentMethod: record.paymentMethod,
    pickup: record.pickup,
    price: record.price,
    receiver: record.receiver,
    sender: record.sender,
    status: record.status,
    trackingId: record.trackingId,
    type: record.type,
    weight: record.weight,
    width: record.width,
  };
}

export default async function TrackingDetailsPage({ params }: TrackingDetailsPageProps) {
  const { trackingId } = await params;
  const supabaseRecord = await getSupabaseTrackingRecord(trackingId);
  const fallbackRecord = getTrackingRecord(trackingId);
  const record = supabaseRecord ?? (fallbackRecord ? mapFallbackRecord(fallbackRecord) : null);

  if (!record) {
    notFound();
  }

  const currentStepIndex = Math.max(statusIndex(record.status), 0);
  const progress = `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%`;
  const canRenderMap =
    typeof record.map.lat === "number" &&
    typeof record.map.lng === "number" &&
    typeof record.map.destinationLat === "number" &&
    typeof record.map.destinationLng === "number";
  const resolvedMap = canRenderMap
    ? {
        lat: record.map.lat as number,
        lng: record.map.lng as number,
        destinationLat: record.map.destinationLat as number,
        destinationLng: record.map.destinationLng as number,
      }
    : null;
  const mapEmbedSrc = canRenderMap
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${resolvedMap!.lng - 5}%2C${resolvedMap!.lat - 5}%2C${resolvedMap!.destinationLng + 5}%2C${resolvedMap!.destinationLat + 5}&layer=mapnik&marker=${resolvedMap!.destinationLat}%2C${resolvedMap!.destinationLng}`
    : "";

  return (
    <section className="tracking-details-page">
      <div className="shell tracking-details-shell">
        <div className="tracking-topbar">
          <div>
            <p className="tracking-kicker">Package Tracking</p>
            <h1>{record.trackingId}</h1>
          </div>
          <button className="secondary-button print-button" type="button">
            <Printer size={18} />
            Print Receipt
          </button>
        </div>

        <div className="tracking-header-card">
          <TrackingBarcode value={record.trackingId} />
          <div className="tracking-summary-grid">
            <div>
              <span>Origin</span>
              <strong>{record.pickup}</strong>
            </div>
            <div>
              <span>Destination</span>
              <strong>{record.destination}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong className="status-pill">{record.status.replaceAll("_", " ")}</strong>
            </div>
          </div>
        </div>

        <div className="timeline-card">
          <h2>Tracking History</h2>
          <div className="timeline">
            <div className="timeline-base" />
            <div className="timeline-progress" style={{ width: progress }} />
            {trackingSteps.map((step, index) => {
              const complete = index <= currentStepIndex;
              const active = index === currentStepIndex;

              return (
                <div key={step.key} className={`timeline-step ${complete ? "complete" : ""} ${active ? "active" : ""}`}>
                  <div className="timeline-icon">
                    <Package size={18} />
                  </div>
                  <div className="timeline-label">{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="tracking-info-grid">
          <article className="info-panel">
            <h3>
              <User size={18} />
              Shipper Information
            </h3>
            <div className="info-row"><span>Full Name</span><strong>{record.sender.fullName}</strong></div>
            <div className="info-row"><span>Country</span><strong>{record.sender.country}</strong></div>
            <div className="info-row"><span>Email</span><strong>{record.sender.email}</strong></div>
            <div className="info-row"><span>Phone</span><strong>{record.sender.phone}</strong></div>
          </article>

          <article className="info-panel">
            <h3>
              <UserRoundSearch size={18} />
              Receiver Information
            </h3>
            <div className="info-row"><span>Full Name</span><strong>{record.receiver.fullName}</strong></div>
            <div className="info-row"><span>Country</span><strong>{record.receiver.country}</strong></div>
            <div className="info-row"><span>Email</span><strong>{record.receiver.email}</strong></div>
            <div className="info-row"><span>Phone</span><strong>{record.receiver.phone}</strong></div>
          </article>

          <article className="info-panel">
            <h3>
              <Truck size={18} />
              Shipment Details
            </h3>
            <div className="info-row"><span>Type</span><strong>{record.type}</strong></div>
            <div className="info-row"><span>Carrier</span><strong>{record.carrier}</strong></div>
            <div className="info-row"><span>Ref Number</span><strong>PARCEL/NUM/{record.id}</strong></div>
            <div className="info-row"><span>Dispatched Date</span><strong>{record.dispatchDate}</strong></div>
            <div className="info-row"><span>Expected Delivery</span><strong>{record.expectedDate}</strong></div>
          </article>

          <article className="info-panel">
            <h3>
              <CalendarClock size={18} />
              Package Details
            </h3>
            <div className="info-row"><span>Item</span><strong>{record.packageName}</strong></div>
            <div className="info-row"><span>Dimensions</span><strong>{record.width} x {record.height} x {record.length}</strong></div>
            <div className="info-row"><span>Weight</span><strong>{record.weight}</strong></div>
            <div className="info-row"><span>Price / Method</span><strong>{record.price} ({record.paymentMethod})</strong></div>
            <div className="info-row"><span>Description</span><strong>{record.comment}</strong></div>
          </article>

          <article className="info-panel">
            <h3>
              <Package size={18} />
              Tracking Events
            </h3>
            {record.events.length ? (
              record.events
                .slice()
                .reverse()
                .slice(0, 4)
                .map((event) => (
                  <div key={`${event.status}-${event.eventTime}`} className="info-row">
                    <span>{event.label}</span>
                    <strong>{event.location ?? event.eventTime}</strong>
                  </div>
                ))
            ) : (
              <div className="info-row"><span>History</span><strong>No tracking events yet</strong></div>
            )}
          </article>
        </div>

        <article className="route-panel">
          <h3>
            <MapPin size={18} />
            Live Route Tracking
          </h3>
          <div className="route-grid">
            <div className="route-copy">
              <div className="route-pill-row">
                <span className="route-pill">Tracking ID: {record.trackingId}</span>
                <span className="route-pill">Carrier: {record.carrier}</span>
              </div>
              <div className="route-stop">
                <span>Current location</span>
                <strong>{record.currentLocation}</strong>
              </div>
              <div className="route-dash" />
              <div className="route-stop">
                <span>Delivery destination</span>
                <strong>{record.destination}</strong>
              </div>
              <p>
                Shipment progress is visualized from the current project data so visitors can
                review the active route, latest hub, and final delivery destination at a glance.
              </p>
            </div>
            {canRenderMap ? (
              <iframe
                src={mapEmbedSrc}
                loading="lazy"
                title={`Map for ${record.trackingId}`}
              />
            ) : (
              <div className="info-panel">
                <div className="info-row">
                  <span>Live map</span>
                  <strong>Route coordinates have not been added yet.</strong>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
