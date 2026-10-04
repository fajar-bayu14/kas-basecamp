import { getDashboardData } from '@/app/actions/transaction';
import { getMembers } from '@/app/actions/member';
import { getIsAdmin } from '@/lib/auth';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; week?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = params.month ? parseInt(params.month, 10) : now.getMonth() + 1;
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const week = params.week ? parseInt(params.week, 10) : null;

  const [dashboardData, members, isAdmin] = await Promise.all([
    getDashboardData(month, year, week),
    getMembers(true),
    getIsAdmin(),
  ]);

  return (
    <DashboardClient
      initialData={dashboardData as any}
      members={members.map((m) => ({
        id: m.id,
        name: m.name,
        isActive: m.isActive,
      }))}
      isAdmin={isAdmin}
    />
  );
}
