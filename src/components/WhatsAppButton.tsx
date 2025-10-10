"use client";
import Link from "next/link";
import { RiWhatsappLine } from "react-icons/ri";

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+923012444831";
  const href = `https://wa.me/${phone.replace(/[^\d+]/g, "")}`;
  return (
    <Link
      href={href}
      target="_blank"
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
    >
      <RiWhatsappLine className="text-lg sm:text-xl" />
      <span className="font-medium text-sm sm:text-base hidden xs:inline">WhatsApp</span>
    </Link>
  );
}


