import { describe, expect, it } from "vitest";

import { getTrackingRecord, trackingSteps } from "./site-data";

describe("tracking records", () => {
  it("finds a shipment by tracking id regardless of case", () => {
    expect(getTrackingRecord("frane12wsu")?.receiver.fullName).toBe("Frances Heydenrych");
  });

  it("returns undefined for unknown tracking ids", () => {
    expect(getTrackingRecord("UNKNOWN123")).toBeUndefined();
  });

  it("keeps timeline status order aligned with supported shipment states", () => {
    expect(trackingSteps.map((step) => step.key)).toEqual([
      "placed",
      "confirmed",
      "intransit",
      "nearby",
      "out_for_delivery",
      "delivered",
    ]);
  });
});
