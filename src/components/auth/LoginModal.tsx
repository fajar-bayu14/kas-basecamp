'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginAdminAction } from '@/app/actions/auth';
import { toast } from 'sonner';
import { Lock, User, KeyRound, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Login Pengelola Kas',
  description = 'Silakan masuk dengan akun pengelola/admin untuk menginput atau mengelola data kas.',
}: LoginModalProps) {
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Username dan password wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginAdminAction({ username, password });
    setIsSubmitting(false);

    if (res.success) {
      toast.success('Berhasil login sebagai Admin. Akses input terbuka!');
      onClose();
      if (onSuccess) {
        onSuccess();
      }
      window.location.reload();
    } else {
      toast.error(res.error || 'Username atau password salah.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      className="sm:max-w-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Username
          </label>
          <Input
            type="text"
            required
            autoComplete="username"
            placeholder="Masukkan username admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Password
          </label>
          <Input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-initial"
          >
            {isSubmitting ? (
              'Memverifikasi...'
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <LogIn className="w-4 h-4" />
                Masuk
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
