import { getMembers } from '@/app/actions/member';
import { getIsAdmin } from '@/lib/auth';
import { MemberManagementClient } from '@/components/members/MemberManagementClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Master Data Anggota - KasMinggu',
  description: 'Kelola daftar nama anggota kas kelas, tim, atau komunitas.',
};

export const dynamic = 'force-dynamic';

export default async function AnggotaPage() {
  const [members, isAdmin] = await Promise.all([
    getMembers(false),
    getIsAdmin(),
  ]);

  return <MemberManagementClient initialMembers={members} isAdmin={isAdmin} />;
}
