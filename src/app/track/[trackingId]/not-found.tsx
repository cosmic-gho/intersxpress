import Link from "next/link";

export default function NotFound() {
  return (
    <section className="tracking-details-page">
      <div className="shell not-found-card">
        <span className="eyebrow">Tracking Error</span>
        <h1>Tracking ID not found</h1>
        <p>
          The requested shipment does not exist in the recreated frontend dataset.
          Try one of the live project IDs from the current database.
        </p>
        <div className="sample-id-list">
          <code>SJNSMSBZHS</code>
          <code>FHE28BWHEX</code>
          <code>FRANE12WSU</code>
        </div>
        <Link className="primary-button" href="/track">
          Return to Tracking
        </Link>
      </div>
    </section>
  );
}
