'use client';

import * as React from 'react';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Phone,
  ArrowLeft,
  FileText,
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

  // Form states
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Sync prop changes
  React.useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  // Filtered members
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

  // Open Add Modal
  const handleOpenAdd = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
      return;
    }
    setFormData({ name: '', phone: '', notes: '' });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
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

  // Handle Create Member
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

  // Handle Update Member
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

  // Handle Toggle Status
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

  // Handle Delete
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
    <div className="space-y-6">
      {/* Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-600" />
            Master Data Anggota Kas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola daftar anggota kas untuk kemudahan pemilihan saat pencatatan mingguan.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="shadow-md shadow-emerald-600/20 flex items-center gap-2 self-start sm:self-auto"
        >
          {isAdmin ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>Tambah Anggota</span>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Total Anggota Terdaftar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              {members.length}{' '}
              <span className="text-sm font-normal text-slate-500">Orang</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/70 bg-emerald-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-emerald-700 tracking-wider">
              Anggota Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-700">
              {activeCount}{' '}
              <span className="text-sm font-normal text-emerald-600/80">Orang</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Anggota Nonaktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-500">
              {inactiveCount}{' '}
              <span className="text-sm font-normal text-slate-400">Orang</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table & Search Toolbar */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari nama atau no. kontak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Menampilkan {filteredMembers.length} dari {members.length} anggota
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-700">
                Tidak ada data anggota ditemukan
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `Tidak ada hasil untuk kata kunci "${searchQuery}". Coba kata kunci lain.`
                  : 'Belum ada anggota kas. Klik tombol "Tambah Anggota" di atas untuk menambahkan.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead className="hidden sm:table-cell">Kontak / HP</TableHead>
                  <TableHead className="hidden md:table-cell">Catatan</TableHead>
                  <TableHead className="text-center">Total Transaksi</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member, idx) => (
                  <TableRow key={member.id} className="hover:bg-slate-50/80">
                    <TableCell className="text-center font-medium text-slate-400 text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      <div>{member.name}</div>
                      <div className="sm:hidden text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        {member.phone && (
                          <span className="flex items-center gap-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {member.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-slate-600 text-xs">
                      {member.phone ? (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {member.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 text-xs max-w-xs truncate">
                      {member.notes || <span className="text-slate-400 italic">-</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono text-[11px]">
                        {member._count.transactions}x Bayar
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleToggleStatus(member)}
                        className={`transition-opacity ${isAdmin ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                        title={isAdmin ? "Klik untuk mengubah status aktif/nonaktif" : "Status keanggotaan"}
                      >
                        {member.isActive ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 text-slate-400">
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Nonaktif</span>
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(member)}
                            className="h-8 w-8 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Edit Anggota"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(member)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Hapus Anggota"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Modal Tambah Anggota */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Anggota Baru"
        description="Masukkan nama anggota kas untuk ditambahkan ke daftar master."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <Input
              required
              placeholder="Contoh: Budi Santoso"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Nomor WhatsApp / HP (Opsional)
            </label>
            <Input
              type="tel"
              placeholder="Contoh: 08123456789"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Catatan Tambahan (Opsional)
            </label>
            <Input
              placeholder="Contoh: Divisi Acara, Anggota Baru"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Anggota'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Anggota */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Data Anggota"
        description={`Memperbarui informasi anggota: ${editingMember?.name || ''}`}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Nomor WhatsApp / HP
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
              Catatan Tambahan
            </label>
            <Input
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Login Modal for unauthorized guests */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsAddModalOpen(true)}
        title="Login Diperlukan"
        description="Silakan masuk sebagai admin untuk mengelola daftar anggota kas."
      />
    </div>
  );
}
