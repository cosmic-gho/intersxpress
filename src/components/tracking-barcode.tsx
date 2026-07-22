"use client";

import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

type TrackingBarcodeProps = {
  value: string;
};

export function TrackingBarcode({ value }: TrackingBarcodeProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    JsBarcode(ref.current, value, {
      displayValue: true,
      fontSize: 16,
      height: 54,
      margin: 8,
      width: 1.8,
    });
  }, [value]);

  return <svg aria-label={`Barcode for ${value}`} ref={ref} />;
}
