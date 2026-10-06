'use client';

import * as React from 'react';
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Phone,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { LoginModal } from '@/components/auth/LoginModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  createMember,
  updateMember,
  toggleMemberStatus,
  deleteMember,
} from '@/app/actions/member';
import { toast } from 'sonner';

type MemberWithCount = {
  id: number;
  name: string;
  phone: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  _count: {
    transactions: number;
  };
};

interface MemberManagementClientProps {
  initialMembers: MemberWithCount[];
  isAdmin?: boolean;
}

export function MemberManagementClient({
  initialMembers,
  isAdmin = false,
}: MemberManagementClientProps) {
  const [members, setMembers] = React.useState<MemberWithCount[]>(initialMembers);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<MemberWithCount | null>(null);

  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const filteredMembers = React.useMemo(() => {
    if (!searchQuery.trim()) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        (m.phone && m.phone.toLowerCase().includes(query)) ||
        (m.notes && m.notes.toLowerCase().includes(query))
    );
  }, [members, searchQuery]);

  const activeCount = members.filter((m) => m.isActive).length;
  const inactiveCount = members.length - activeCount;

  const handleOpenAdd = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setFormData({ name: '', phone: '', notes: '' });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (member: MemberWithCount) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingMember(member);
    setFormData({
      name: member.name,
      phone: member.phone || '',
      notes: member.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Nama anggota wajib diisi');
      return;
    }
    setIsSubmitting(true);
    const res = await createMember(formData);
    setIsSubmitting(false);
    if (res.success && res.member) {
      toast.success(`Anggota "${res.member.name}" berhasil ditambahkan!`);
      setIsAddModalOpen(false);
      setFormData({ name: '', phone: '', notes: '' });
    } else {
      toast.error(res.error || 'Gagal menambahkan anggota');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!formData.name.trim()) {
      toast.error('Nama anggota wajib diisi');
      return;
    }
    setIsSubmitting(true);
    const res = await updateMember(editingMember.id, {
      ...formData,
      isActive: editingMember.isActive,
    });
    setIsSubmitting(false);
    if (res.success && res.member) {
      toast.success('Data anggota berhasil diperbarui!');
      setIsEditModalOpen(false);
      setEditingMember(null);
    } else {
      toast.error(res.error || 'Gagal memperbarui anggota');
    }
  };

  const handleToggleStatus = async (member: MemberWithCount) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    const res = await toggleMemberStatus(member.id);
    if (res.success && res.member) {
      toast.success(
        `Status ${member.name} diubah menjadi ${
          res.member.isActive ? 'Aktif' : 'Nonaktif'
        }`
      );
    } else {
      toast.error(res.error || 'Gagal mengubah status');
    }
  };

  const handleDelete = async (member: MemberWithCount) => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    if (
      !confirm(
        `Yakin ingin menghapus ${member.name}? Semua riwayat transaksi kas terkait akan ikut terhapus!`
      )
    ) {
      return;
    }
    const res = await deleteMember(member.id);
    if (res.success) {
      toast.success(`Anggota ${member.name} berhasil dihapus`);
    } else {
      toast.error(res.error || 'Gagal menghapus anggota');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke dashboard
          </Link>
          <h1 className="mt-1 flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground"><Users className="h-5 w-5 text-accent" />Master Data Anggota Kas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola daftar anggota kas untuk kemudahan pemilihan saat pencatatan mingguan.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 self-start sm:self-auto">
          {isAdmin ? <UserPlus className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          Tambah anggota
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total terdaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-card-foreground">{members.length} <span className="text-sm font-normal text-muted-foreground">orang</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-card-foreground">{activeCount} <span className="text-sm font-normal text-muted-foreground">orang</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nonaktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-muted-foreground">{inactiveCount} <span className="text-sm font-normal text-muted-foreground">orang</span></div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari nama atau kontak..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <span className="text-xs text-muted-foreground">{filteredMembers.length} dari {members.length} anggota</span>
        </div>

        <CardContent className="p-0">
          {filteredMembers.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-card-foreground">Tidak ada anggota</p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}".` : 'Belum ada anggota. Tambahkan anggota pertama.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden sm:table-cell">Kontak</TableHead>
                  <TableHead className="hidden md:table-cell">Catatan</TableHead>
                  <TableHead className="text-center">Transaksi</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member, idx) => (
                  <TableRow key={member.id}>
                    <TableCell className="text-center text-xs text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-card-foreground">{member.name}</div>
                      {member.phone && (
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
                          <Phone className="h-3 w-3 text-muted-foreground" />{member.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                      {member.phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{member.phone}</span> : <span className="text-muted-foreground/60">—</span>}
                    </TableCell>
                    <TableCell className="hidden max-w-[14rem] truncate text-xs text-muted-foreground md:table-cell">
                      {member.notes || <span className="text-muted-foreground/60">—</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-[11px]">{member._count.transactions}×</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleToggleStatus(member)}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                        title={isAdmin ? 'Ubah status' : 'Status keanggotaan'}
                      >
                        <Badge variant={member.isActive ? 'success' : 'warning'}>
                          {member.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </button>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(member)} className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(member)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" aria-label="Hapus">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah anggota" description="Masukkan data anggota baru.">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nama lengkap <span className="text-destructive">*</span></label>
            <Input required placeholder="Budi Santoso" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} autoFocus />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">No. WhatsApp (opsional)</label>
            <Input type="tel" placeholder="08123456789" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Catatan (opsional)</label>
            <Input placeholder="Divisi / keterangan" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit anggota" description={editingMember ? `Mengubah ${editingMember.name}` : undefined}>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nama lengkap <span className="text-destructive">*</span></label>
            <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">No. WhatsApp</label>
            <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Catatan</label>
            <Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </form>
      </Modal>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSuccess={() => setIsAddModalOpen(true)} title="Login diperlukan" description="Masuk sebagai admin untuk mengelola anggota." />
    </div>
  );
}
