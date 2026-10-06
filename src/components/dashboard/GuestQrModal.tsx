'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle } from 'lucide-react';

interface GuestQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WA_URL =
  'https://wa.me/62895614790050?text=Halo%20Admin%2C%20saya%20sudah%20transfer%20kas%20mingguan.';

export function GuestQrModal({ isOpen, onClose }: GuestQrModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bayar kas via QR"
      description="Pindai QR untuk transfer, lalu konfirmasi ke admin."
      className="sm:max-w-sm"
    >
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border bg-white p-2">
          <img
            src="/qr-kas.png"
            alt="QR pembayaran kas Basecamp"
            className="h-auto w-full object-contain"
            loading="lazy"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Pindai QR di atas untuk transfer. Simpan QR jika perlu, lalu
            konfirmasi ke admin via WhatsApp.
          </p>
          <p className="text-xs text-muted-foreground">
            Preferensi tunai? Bayar langsung ke admin.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href="/qr-kas.png"
            download="QR-Kas-Basecamp.png"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Download className="h-4 w-4" />
            Unduh QR
          </a>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageCircle className="h-4 w-4" />
            Konfirmasi via WhatsApp
          </a>
        </div>
      </div>
    </Modal>
  );
}
