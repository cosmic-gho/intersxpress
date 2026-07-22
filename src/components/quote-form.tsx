"use client";

import { FormEvent, useMemo, useState } from "react";

const initialForm = {
  senderName: "",
  senderEmail: "",
  senderCountry: "",
  senderPhone: "",
  receiverName: "",
  receiverEmail: "",
  receiverCountry: "",
  receiverPhone: "",
  pickup: "",
  destination: "",
  pickupDate: "",
  deliveryDate: "",
  paymentMethod: "Crypto",
  packageType: "Parcel",
  weight: "0KG - 10KG+",
  length: "Normal Range",
  height: "Normal Range",
  width: "Normal Range",
  comment: "",
};

export function QuoteForm() {
  const [form, setForm] = useState(initialForm);
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const paymentOptions = useMemo(
    () => ["Crypto", "Bank Transfer", "PayPal", "CashApp", "Cheque", "Net Banking", "GooglePay", "Paytm", "GiftCard"],
    [],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setTrackingId("");
    setLoading(true);

    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = (await response.json().catch(() => null)) as { error?: string; trackingId?: string } | null;

    setLoading(false);

    if (!response.ok || !result?.trackingId) {
      setError(result?.error ?? "We could not save your quote request right now.");
      return;
    }

    setTrackingId(result.trackingId);
    setForm(initialForm);
  }

  return (
    <form className="quote-form" onSubmit={onSubmit}>
      <div className="quote-grid">
        <input className="text-input" placeholder="Sender Name" required value={form.senderName} onChange={(event) => setForm({ ...form, senderName: event.target.value })} />
        <input className="text-input" placeholder="Sender Email" required type="email" value={form.senderEmail} onChange={(event) => setForm({ ...form, senderEmail: event.target.value })} />
        <input className="text-input" placeholder="Sender Country" required value={form.senderCountry} onChange={(event) => setForm({ ...form, senderCountry: event.target.value })} />
        <input className="text-input" placeholder="Sender Telephone" required value={form.senderPhone} onChange={(event) => setForm({ ...form, senderPhone: event.target.value })} />
        <input className="text-input" placeholder="Receiver Name" required value={form.receiverName} onChange={(event) => setForm({ ...form, receiverName: event.target.value })} />
        <input className="text-input" placeholder="Receiver Email" required type="email" value={form.receiverEmail} onChange={(event) => setForm({ ...form, receiverEmail: event.target.value })} />
        <input className="text-input" placeholder="Receiver Country" required value={form.receiverCountry} onChange={(event) => setForm({ ...form, receiverCountry: event.target.value })} />
        <input className="text-input" placeholder="Receiver Telephone" required value={form.receiverPhone} onChange={(event) => setForm({ ...form, receiverPhone: event.target.value })} />
        <input className="text-input" placeholder="Origin" required value={form.pickup} onChange={(event) => setForm({ ...form, pickup: event.target.value })} />
        <input className="text-input" placeholder="Destination" required value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} />
        <input className="text-input" required type="datetime-local" value={form.pickupDate} onChange={(event) => setForm({ ...form, pickupDate: event.target.value })} />
        <input className="text-input" required type="datetime-local" value={form.deliveryDate} onChange={(event) => setForm({ ...form, deliveryDate: event.target.value })} />
        <select className="text-input" value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}>
          {paymentOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select className="text-input" value={form.packageType} onChange={(event) => setForm({ ...form, packageType: event.target.value })}>
          <option>Parcel</option>
          <option>Cargo</option>
          <option>Shipment</option>
        </select>
        <select className="text-input" value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })}>
          <option>0KG - 10KG+</option>
          <option>11KG - 100KG+</option>
          <option>101KG - 1000KG+</option>
          <option>More than 1000KG+</option>
        </select>
        <select className="text-input" value={form.length} onChange={(event) => setForm({ ...form, length: event.target.value })}>
          <option>Normal Range</option>
          <option>Medium Range</option>
          <option>Extended Range</option>
        </select>
        <select className="text-input" value={form.height} onChange={(event) => setForm({ ...form, height: event.target.value })}>
          <option>Normal Range</option>
          <option>Medium Range</option>
          <option>Extended Range</option>
        </select>
        <select className="text-input" value={form.width} onChange={(event) => setForm({ ...form, width: event.target.value })}>
          <option>Normal Range</option>
          <option>Medium Range</option>
          <option>Extended Range</option>
        </select>
        <div className="quote-note">
          <textarea
            className="text-area"
            placeholder="Comment"
            rows={6}
            value={form.comment}
            onChange={(event) => setForm({ ...form, comment: event.target.value })}
          />
        </div>
      </div>
      {trackingId ? (
        <p className="form-success">
          Quote created successfully. Your tracking ID is <strong>{trackingId}</strong>
        </p>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" type="submit">
        {loading ? "Submitting..." : "Request a Quote"}
      </button>
    </form>
  );
}
