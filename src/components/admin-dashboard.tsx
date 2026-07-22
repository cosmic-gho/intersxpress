"use client";

import { FormEvent, useMemo, useState } from "react";

import {
  type AdminContactMessage,
  type AdminShipment,
  type ContactMessageStatus,
  shipmentStatusOptions,
} from "@/lib/supabase/dashboard";

type AdminDashboardProps = {
  admin: {
    email: string | null;
    fullName: string | null;
  };
  initialContactMessages: AdminContactMessage[];
  initialShipments: AdminShipment[];
};

const SHIPMENTS_PER_PAGE = 4;
const CONTACT_MESSAGES_PER_PAGE = 5;

type ShipmentEditorState = {
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

type CreateShipmentState = {
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

const initialShipmentCreateState: CreateShipmentState = {
  comment: "",
  currentLat: "",
  currentLocation: "",
  currentLng: "",
  destination: "",
  destinationLat: "",
  destinationLng: "",
  dispatchDate: "",
  eventDetails: "",
  eventLabel: "Shipment created by admin",
  expectedDate: "",
  height: "",
  length: "",
  packageName: "Parcel",
  paymentMethod: "Bank Transfer",
  pickup: "",
  price: "Pending",
  receiverCountry: "",
  receiverEmail: "",
  receiverFullName: "",
  receiverPhone: "",
  senderCountry: "",
  senderEmail: "",
  senderFullName: "",
  senderPhone: "",
  status: "placed",
  trackingId: "",
  type: "Package",
  weight: "",
  width: "",
};

function numberToInput(value: number | null) {
  return value === null ? "" : String(value);
}

function toInputDateTime(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function createEditorState(shipment: AdminShipment): ShipmentEditorState {
  return {
    currentLat: numberToInput(shipment.currentLat),
    currentLocation: shipment.currentLocation,
    currentLng: numberToInput(shipment.currentLng),
    destinationLat: numberToInput(shipment.destinationLat),
    destinationLng: numberToInput(shipment.destinationLng),
    eventDetails: "",
    eventLabel: shipment.status === "delivered" ? "Shipment delivered" : "Tracking update",
    expectedDate: toInputDateTime(shipment.expectedDate),
    price: shipment.price,
    status: shipment.status,
  };
}

export function AdminDashboard({
  admin,
  initialContactMessages,
  initialShipments,
}: AdminDashboardProps) {
  const [shipments, setShipments] = useState(initialShipments);
  const [contactMessages, setContactMessages] = useState(initialContactMessages);
  const [savingId, setSavingId] = useState("");
  const [messageSavingId, setMessageSavingId] = useState("");
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [trackingSearch, setTrackingSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createShipmentState, setCreateShipmentState] = useState(initialShipmentCreateState);
  const [shipmentPage, setShipmentPage] = useState(1);
  const [contactPage, setContactPage] = useState(1);
  const [deletingShipmentId, setDeletingShipmentId] = useState("");

  const [editorState, setEditorState] = useState<Record<string, ShipmentEditorState>>(
    Object.fromEntries(
      initialShipments.map((shipment) => [shipment.id, createEditorState(shipment)]),
    ),
  );

  const stats = useMemo(
    () => ({
      active: shipments.filter((shipment) => shipment.status !== "delivered").length,
      contacts: contactMessages.filter((item) => item.status !== "archived").length,
      delivered: shipments.filter((shipment) => shipment.status === "delivered").length,
      total: shipments.length,
    }),
    [contactMessages, shipments],
  );

  const filteredShipments = useMemo(() => {
    const normalizedSearch = trackingSearch.trim().toUpperCase();

    return shipments.filter((shipment) => {
      const matchesTracking = normalizedSearch
        ? shipment.trackingId.toUpperCase().includes(normalizedSearch)
        : true;
      const matchesStatus = statusFilter === "all" ? true : shipment.status === statusFilter;

      return matchesTracking && matchesStatus;
    });
  }, [shipments, statusFilter, trackingSearch]);

  const shipmentTotalPages = Math.max(1, Math.ceil(filteredShipments.length / SHIPMENTS_PER_PAGE));
  const safeShipmentPage = Math.min(shipmentPage, shipmentTotalPages);
  const paginatedShipments = filteredShipments.slice(
    (safeShipmentPage - 1) * SHIPMENTS_PER_PAGE,
    safeShipmentPage * SHIPMENTS_PER_PAGE,
  );

  const contactTotalPages = Math.max(1, Math.ceil(contactMessages.length / CONTACT_MESSAGES_PER_PAGE));
  const safeContactPage = Math.min(contactPage, contactTotalPages);
  const paginatedContactMessages = contactMessages.slice(
    (safeContactPage - 1) * CONTACT_MESSAGES_PER_PAGE,
    safeContactPage * CONTACT_MESSAGES_PER_PAGE,
  );

  function updateField(shipmentId: string, field: keyof ShipmentEditorState, value: string) {
    setEditorState((current) => ({
      ...current,
      [shipmentId]: {
        ...current[shipmentId],
        [field]: value,
      },
    }));
  }

  function updateCreateField(field: keyof CreateShipmentState, value: string) {
    setCreateShipmentState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>, shipment: AdminShipment) {
    event.preventDefault();
    setSavingId(shipment.id);
    setError("");
    setMessage("");

    const payload = editorState[shipment.id];

    const response = await fetch(`/api/admin/shipments/${shipment.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as
      | {
          error?: string;
          shipment?: AdminShipment;
        }
      | null;

    setSavingId("");

    if (!response.ok || !result?.shipment) {
      setError(result?.error ?? "Unable to update this shipment right now.");
      return;
    }

    const updatedShipment = result.shipment;

    setShipments((current) =>
      current.map((item) => (item.id === updatedShipment.id ? updatedShipment : item)),
    );
    setEditorState((current) => ({
      ...current,
      [shipment.id]: {
        ...current[shipment.id],
        currentLat: numberToInput(updatedShipment.currentLat),
        currentLocation: updatedShipment.currentLocation,
        currentLng: numberToInput(updatedShipment.currentLng),
        destinationLat: numberToInput(updatedShipment.destinationLat),
        destinationLng: numberToInput(updatedShipment.destinationLng),
        eventDetails: "",
        expectedDate: toInputDateTime(updatedShipment.expectedDate),
        price: updatedShipment.price,
        status: updatedShipment.status,
      },
    }));
    setMessage(`Shipment ${updatedShipment.trackingId} updated successfully.`);
  }

  async function onDeleteShipment(shipment: AdminShipment) {
    const confirmed = window.confirm(`Delete shipment ${shipment.trackingId}? This also removes its tracking events.`);

    if (!confirmed) {
      return;
    }

    setDeletingShipmentId(shipment.id);
    setError("");
    setMessage("");

    const response = await fetch(`/api/admin/shipments/${shipment.id}`, {
      method: "DELETE",
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    setDeletingShipmentId("");

    if (!response.ok) {
      setError(result?.error ?? "Unable to delete this shipment.");
      return;
    }

    setShipments((current) => current.filter((item) => item.id !== shipment.id));
    setEditorState((current) => {
      const next = { ...current };
      delete next[shipment.id];
      return next;
    });
    setMessage(`Shipment ${shipment.trackingId} deleted successfully.`);
  }

  async function onCreateShipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingShipment(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createShipmentState),
    });

    const result = (await response.json().catch(() => null)) as
      | {
          error?: string;
          shipment?: AdminShipment;
        }
      | null;

    setCreatingShipment(false);

    if (!response.ok || !result?.shipment) {
      setError(result?.error ?? "Unable to create shipment right now.");
      return;
    }

    const createdShipment = result.shipment;

    setShipments((current) => [createdShipment, ...current]);
    setEditorState((current) => ({
      ...current,
      [createdShipment.id]: createEditorState(createdShipment),
    }));
    setShipmentPage(1);
    setCreateShipmentState(initialShipmentCreateState);
    setMessage(`Shipment ${createdShipment.trackingId} created successfully.`);
  }

  async function updateContactMessage(messageId: string, status: ContactMessageStatus) {
    setMessageSavingId(messageId);
    setError("");
    setMessage("");

    const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = (await response.json().catch(() => null)) as
      | {
          error?: string;
          message?: AdminContactMessage;
        }
      | null;

    setMessageSavingId("");

    if (!response.ok || !result?.message) {
      setError(result?.error ?? "Unable to update this contact message.");
      return;
    }

    const updatedMessage = result.message;

    setContactMessages((current) =>
      current.map((item) => (item.id === updatedMessage.id ? updatedMessage : item)),
    );
    setMessage(`Contact message from ${updatedMessage.email} updated.`);
  }

  return (
    <section className="track-page-surface">
      <div className="shell">
        <div className="tracking-search-card">
          <div className="form-title">
            <h3>Admin Dashboard</h3>
            <p>
              Signed in as {admin.fullName ?? admin.email ?? "Admin"}. Manage shipment statuses,
              expected delivery dates, pricing, and tracking updates from here.
            </p>
          </div>

          <div className="tracking-summary-grid">
            <div>
              <span>Total Shipments</span>
              <strong>{stats.total}</strong>
            </div>
            <div>
              <span>Active Shipments</span>
              <strong>{stats.active}</strong>
            </div>
            <div>
              <span>Delivered</span>
              <strong>{stats.delivered}</strong>
            </div>
            <div>
              <span>Open Messages</span>
              <strong>{stats.contacts}</strong>
            </div>
          </div>
        </div>

        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <div className="admin-dashboard-grid admin-sections-grid">
          <article className="info-panel admin-dashboard-card admin-panel-wide">
            <div className="admin-dashboard-head">
              <div>
                <span className="tracking-kicker">Manual Shipment</span>
                <h3>Create Shipment</h3>
              </div>
            </div>

            <form className="admin-create-form" onSubmit={onCreateShipment}>
              <input
                className="text-input"
                placeholder="Tracking ID (leave blank to auto-generate)"
                type="text"
                value={createShipmentState.trackingId}
                onChange={(event) => updateCreateField("trackingId", event.target.value)}
              />
              <select
                className="text-input"
                value={createShipmentState.status}
                onChange={(event) => updateCreateField("status", event.target.value)}
              >
                {shipmentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
              <input
                className="text-input"
                placeholder="Sender full name"
                required
                type="text"
                value={createShipmentState.senderFullName}
                onChange={(event) => updateCreateField("senderFullName", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Sender email"
                required
                type="email"
                value={createShipmentState.senderEmail}
                onChange={(event) => updateCreateField("senderEmail", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Sender country"
                required
                type="text"
                value={createShipmentState.senderCountry}
                onChange={(event) => updateCreateField("senderCountry", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Sender phone"
                required
                type="text"
                value={createShipmentState.senderPhone}
                onChange={(event) => updateCreateField("senderPhone", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Receiver full name"
                required
                type="text"
                value={createShipmentState.receiverFullName}
                onChange={(event) => updateCreateField("receiverFullName", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Receiver email"
                required
                type="email"
                value={createShipmentState.receiverEmail}
                onChange={(event) => updateCreateField("receiverEmail", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Receiver country"
                required
                type="text"
                value={createShipmentState.receiverCountry}
                onChange={(event) => updateCreateField("receiverCountry", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Receiver phone"
                required
                type="text"
                value={createShipmentState.receiverPhone}
                onChange={(event) => updateCreateField("receiverPhone", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Pickup location"
                required
                type="text"
                value={createShipmentState.pickup}
                onChange={(event) => updateCreateField("pickup", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Destination"
                required
                type="text"
                value={createShipmentState.destination}
                onChange={(event) => updateCreateField("destination", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Current location"
                required
                type="text"
                value={createShipmentState.currentLocation}
                onChange={(event) => updateCreateField("currentLocation", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Current latitude"
                type="text"
                value={createShipmentState.currentLat}
                onChange={(event) => updateCreateField("currentLat", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Current longitude"
                type="text"
                value={createShipmentState.currentLng}
                onChange={(event) => updateCreateField("currentLng", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Destination latitude"
                type="text"
                value={createShipmentState.destinationLat}
                onChange={(event) => updateCreateField("destinationLat", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Destination longitude"
                type="text"
                value={createShipmentState.destinationLng}
                onChange={(event) => updateCreateField("destinationLng", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Shipment type"
                required
                type="text"
                value={createShipmentState.type}
                onChange={(event) => updateCreateField("type", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Package name"
                required
                type="text"
                value={createShipmentState.packageName}
                onChange={(event) => updateCreateField("packageName", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Payment method"
                required
                type="text"
                value={createShipmentState.paymentMethod}
                onChange={(event) => updateCreateField("paymentMethod", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Price"
                required
                type="text"
                value={createShipmentState.price}
                onChange={(event) => updateCreateField("price", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Width"
                required
                type="text"
                value={createShipmentState.width}
                onChange={(event) => updateCreateField("width", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Height"
                required
                type="text"
                value={createShipmentState.height}
                onChange={(event) => updateCreateField("height", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Length"
                required
                type="text"
                value={createShipmentState.length}
                onChange={(event) => updateCreateField("length", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Weight"
                required
                type="text"
                value={createShipmentState.weight}
                onChange={(event) => updateCreateField("weight", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Dispatch date"
                type="datetime-local"
                value={createShipmentState.dispatchDate}
                onChange={(event) => updateCreateField("dispatchDate", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Expected delivery"
                type="datetime-local"
                value={createShipmentState.expectedDate}
                onChange={(event) => updateCreateField("expectedDate", event.target.value)}
              />
              <input
                className="text-input"
                placeholder="Initial event title"
                type="text"
                value={createShipmentState.eventLabel}
                onChange={(event) => updateCreateField("eventLabel", event.target.value)}
              />
              <textarea
                className="text-area admin-form-span"
                placeholder="Shipment description"
                rows={4}
                value={createShipmentState.comment}
                onChange={(event) => updateCreateField("comment", event.target.value)}
              />
              <textarea
                className="text-area admin-form-span"
                placeholder="Initial tracking event details"
                rows={4}
                value={createShipmentState.eventDetails}
                onChange={(event) => updateCreateField("eventDetails", event.target.value)}
              />
              <button className="primary-button admin-form-span" disabled={creatingShipment} type="submit">
                {creatingShipment ? "Creating..." : "Create Shipment"}
              </button>
            </form>
          </article>
        </div>

        <div className="tracking-search-card admin-filter-card">
          <div className="form-title">
            <h3>Shipment Search</h3>
            <p>Search by tracking ID and filter by shipment status.</p>
          </div>
          <div className="admin-filter-grid">
            <input
              className="text-input"
              placeholder="Search tracking ID"
              type="text"
              value={trackingSearch}
                onChange={(event) => {
                  setTrackingSearch(event.target.value);
                  setShipmentPage(1);
                }}
            />
            <select
              className="text-input"
              value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setShipmentPage(1);
                }}
            >
              <option value="all">All statuses</option>
              {shipmentStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-dashboard-grid">
          {paginatedShipments.length === 0 ? (
            <article className="info-panel admin-dashboard-card">
              <h3>No matching shipments</h3>
              <p>
                Adjust the tracking search or status filter, or create a shipment manually.
              </p>
            </article>
          ) : null}

          {paginatedShipments.map((shipment) => {
            const editor = editorState[shipment.id];

            return (
              <article key={shipment.id} className="info-panel admin-dashboard-card">
                <div className="admin-dashboard-head">
                  <div>
                    <span className="tracking-kicker">Tracking ID</span>
                    <h3>{shipment.trackingId}</h3>
                  </div>
                  <strong className="status-pill">{shipment.status.replaceAll("_", " ")}</strong>
                </div>

                <div className="admin-dashboard-meta">
                  <div className="info-row"><span>Route</span><strong>{shipment.pickup} to {shipment.destination}</strong></div>
                  <div className="info-row"><span>Sender</span><strong>{shipment.senderFullName}</strong></div>
                  <div className="info-row"><span>Receiver</span><strong>{shipment.receiverFullName}</strong></div>
                  <div className="info-row"><span>Package</span><strong>{shipment.packageName} ({shipment.type})</strong></div>
                  <div className="info-row"><span>Payment</span><strong>{shipment.paymentMethod}</strong></div>
                  <div className="info-row"><span>Map</span><strong>{shipment.currentLat ?? "?"}, {shipment.currentLng ?? "?"} to {shipment.destinationLat ?? "?"}, {shipment.destinationLng ?? "?"}</strong></div>
                </div>

                <form className="admin-shipment-form" onSubmit={(event) => onSubmit(event, shipment)}>
                  <select
                    className="text-input"
                    value={editor.status}
                    onChange={(event) => updateField(shipment.id, "status", event.target.value)}
                  >
                    {shipmentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>

                  <input
                    className="text-input"
                    placeholder="Current location"
                    type="text"
                    value={editor.currentLocation}
                    onChange={(event) => updateField(shipment.id, "currentLocation", event.target.value)}
                  />

                  <input
                    className="text-input"
                    placeholder="Expected delivery"
                    type="datetime-local"
                    value={editor.expectedDate}
                    onChange={(event) => updateField(shipment.id, "expectedDate", event.target.value)}
                  />

                  <input
                    className="text-input"
                    placeholder="Current latitude"
                    type="text"
                    value={editor.currentLat}
                    onChange={(event) => updateField(shipment.id, "currentLat", event.target.value)}
                  />

                  <input
                    className="text-input"
                    placeholder="Current longitude"
                    type="text"
                    value={editor.currentLng}
                    onChange={(event) => updateField(shipment.id, "currentLng", event.target.value)}
                  />

                  <input
                    className="text-input"
                    placeholder="Destination latitude"
                    type="text"
                    value={editor.destinationLat}
                    onChange={(event) => updateField(shipment.id, "destinationLat", event.target.value)}
                  />

                  <input
                    className="text-input"
                    placeholder="Destination longitude"
                    type="text"
                    value={editor.destinationLng}
                    onChange={(event) => updateField(shipment.id, "destinationLng", event.target.value)}
                  />

                  <input
                    className="text-input"
                    placeholder="Price"
                    type="text"
                    value={editor.price}
                    onChange={(event) => updateField(shipment.id, "price", event.target.value)}
                  />

                  <input
                    className="text-input"
                    placeholder="Tracking event title"
                    type="text"
                    value={editor.eventLabel}
                    onChange={(event) => updateField(shipment.id, "eventLabel", event.target.value)}
                  />

                  <textarea
                    className="text-area"
                    placeholder="Tracking event details"
                    rows={4}
                    value={editor.eventDetails}
                    onChange={(event) => updateField(shipment.id, "eventDetails", event.target.value)}
                  />

                  <div className="admin-inline-actions">
                    <button
                      className="primary-button full-width"
                      disabled={savingId === shipment.id || deletingShipmentId === shipment.id}
                      type="submit"
                    >
                      {savingId === shipment.id ? "Saving..." : "Update Shipment"}
                    </button>
                    <button
                      className="secondary-button full-width admin-delete-button"
                      disabled={savingId === shipment.id || deletingShipmentId === shipment.id}
                      type="button"
                      onClick={() => onDeleteShipment(shipment)}
                    >
                      {deletingShipmentId === shipment.id ? "Deleting..." : "Delete Shipment"}
                    </button>
                  </div>
                </form>
              </article>
            );
          })}
        </div>

        <div className="admin-pagination">
          <button
            className="secondary-button admin-action-button"
            disabled={safeShipmentPage <= 1}
            type="button"
            onClick={() => setShipmentPage((current) => Math.max(1, current - 1))}
          >
            Previous Shipments
          </button>
          <span>Page {safeShipmentPage} of {shipmentTotalPages}</span>
          <button
            className="secondary-button admin-action-button"
            disabled={safeShipmentPage >= shipmentTotalPages}
            type="button"
            onClick={() => setShipmentPage((current) => Math.min(shipmentTotalPages, current + 1))}
          >
            Next Shipments
          </button>
        </div>

        <div className="admin-dashboard-grid admin-contact-grid">
          <article className="info-panel admin-dashboard-card admin-panel-wide">
            <div className="admin-dashboard-head">
              <div>
                <span className="tracking-kicker">Inbox</span>
                <h3>Contact Messages</h3>
              </div>
            </div>

            {contactMessages.length === 0 ? (
              <p>No contact messages yet.</p>
            ) : (
              <div className="admin-contact-list">
                {paginatedContactMessages.map((contactMessage) => (
                  <article key={contactMessage.id} className="admin-contact-item">
                    <div className="admin-contact-head">
                      <div>
                        <strong>{contactMessage.subject}</strong>
                        <p>
                          {contactMessage.name} · {contactMessage.email}
                        </p>
                      </div>
                      <span className="status-pill">{contactMessage.status}</span>
                    </div>
                    <p>{contactMessage.message}</p>
                    <div className="admin-contact-actions">
                      <button
                        className="secondary-button admin-action-button"
                        disabled={messageSavingId === contactMessage.id}
                        type="button"
                        onClick={() => updateContactMessage(contactMessage.id, "new")}
                      >
                        Mark New
                      </button>
                      <button
                        className="secondary-button admin-action-button"
                        disabled={messageSavingId === contactMessage.id}
                        type="button"
                        onClick={() => updateContactMessage(contactMessage.id, "read")}
                      >
                        Mark Read
                      </button>
                      <button
                        className="secondary-button admin-action-button"
                        disabled={messageSavingId === contactMessage.id}
                        type="button"
                        onClick={() => updateContactMessage(contactMessage.id, "archived")}
                      >
                        Archive
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>
        </div>

        <div className="admin-pagination">
          <button
            className="secondary-button admin-action-button"
            disabled={safeContactPage <= 1}
            type="button"
            onClick={() => setContactPage((current) => Math.max(1, current - 1))}
          >
            Previous Messages
          </button>
          <span>Page {safeContactPage} of {contactTotalPages}</span>
          <button
            className="secondary-button admin-action-button"
            disabled={safeContactPage >= contactTotalPages}
            type="button"
            onClick={() => setContactPage((current) => Math.min(contactTotalPages, current + 1))}
          >
            Next Messages
          </button>
        </div>
      </div>
    </section>
  );
}
