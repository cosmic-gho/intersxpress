"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Search } from "lucide-react";

type TrackingSearchFormProps = {
  variant?: "hero" | "page";
};

export function TrackingSearchForm({ variant = "page" }: TrackingSearchFormProps) {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");

  const classes = useMemo(
    () =>
      variant === "hero"
        ? {
            wrapper: "tracking-panel",
            button: "primary-button full-width",
          }
        : {
            wrapper: "tracking-search-card",
            button: "primary-button full-width page-search-button",
          },
    [variant],
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = trackingId.trim().toUpperCase();

    if (!normalized) {
      setError("Please enter a valid tracking ID.");
      return;
    }

    setError("");
    router.push(`/track/${normalized}`);
  }

  return (
    <div className={classes.wrapper}>
      <div className="form-title">
        <h3>{variant === "hero" ? "Track Shipments" : "TRACK YOUR SHIPMENT"}</h3>
        <p>
          {variant === "hero"
            ? "Kindly input your tracking number here."
            : "Enter your tracking number below to get real-time updates on your parcel's location."}
        </p>
      </div>
      <form className="stack-form" onSubmit={onSubmit}>
        <input
          aria-label="Tracking number"
          className="text-input"
          name="trackingId"
          placeholder={variant === "hero" ? "eg. AWB123456789" : "Tracking Number (eg. AWB7888432455)"}
          type="text"
          value={trackingId}
          onChange={(event) => setTrackingId(event.target.value)}
        />
        {variant === "page" ? (
          <p className="tracking-help">
            Need help? Contact <a href="mailto:support@interexpressservice.site">support@interexpressservice.site</a>
          </p>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        <button className={classes.button} type="submit">
          <Search size={18} />
          {variant === "hero" ? "Track Now!!!" : "Track Shipment"}
        </button>
      </form>
    </div>
  );
}
