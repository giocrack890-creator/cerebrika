"use client";

import { BuyButton } from "@/components/landing/checkout";

export function BuyBar({ priceLabel, label }: { priceLabel: string | null; label: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#F3EEE6]/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-[1120px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[#6B4F3B] uppercase">Pago único</p>
          <p className="truncate text-sm font-semibold">{priceLabel ?? "Precio a confirmar"}</p>
        </div>
        <BuyButton label={label} className="btn btn-primary shrink-0 px-5 py-3 text-sm" />
      </div>
    </div>
  );
}
