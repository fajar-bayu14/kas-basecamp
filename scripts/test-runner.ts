import { recordCashPayment, getDashboardData, deleteTransaction } from '../src/app/actions/transaction';
import { createMember, getMembers, toggleMemberStatus, updateMember, deleteMember } from '../src/app/actions/member';
import { generateTransactionsCsv, formatExportDate, ExportRowData } from '../src/lib/exportService';

async function runTests() {
  console.log('=== MEMULAI TEST SUITE OTOMATIS KASMINGGU ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Test CSV Generator Format (PRD Section 9)
    console.log('--- TEST 1: Standarisasi Format Ekspor CSV (PRD Section 9) ---');
    const mockExportRows: ExportRowData[] = [
      {
        no: 1,
        name: 'Budi Santoso',
        paymentDate: '2026-09-05T00:00:00.000Z',
        weekNumber: 1,
        amount: 5000,
      },
      {
        no: 2,
        name: 'Siti Aminah',
        paymentDate: '2026-09-05T00:00:00.000Z',
        weekNumber: 1,
        amount: 5000,
      },
    ];

    const csvOutput = generateTransactionsCsv(mockExportRows);
    assert(
      csvOutput.includes('No,Nama,Tanggal Bayar,Minggu ke-,Jumlah Bayar'),
      'Header CSV persis sesuai PRD Section 9'
    );
    assert(
      csvOutput.includes('1,"Budi Santoso",05/09/2026,"Minggu 1",5000'),
      'Format baris CSV, escaping kutip nama, dan tanggal DD/MM/YYYY benar'
    );
    assert(
      formatExportDate('2026-09-05T00:00:00.000Z') === '05/09/2026',
      'Formatting tanggal ISO ke DD/MM/YYYY akurat'
    );

    // 2. Test Master Anggota Actions
    console.log('\n--- TEST 2: Master Anggota Server Actions ---');
    const createRes = await createMember({
      name: 'Anggota Test Otomatis',
      phone: '0899999999',
      notes: 'Test Unit',
    });
    assert(createRes.success === true && !!createRes.member, 'createMember berhasil menyimpan anggota');
    const testMemberId = createRes.member!.id;

    const toggleRes = await toggleMemberStatus(testMemberId);
    assert(toggleRes.success === true && toggleRes.member?.isActive === false, 'toggleMemberStatus mengubah status ke Nonaktif');

    const toggleBackRes = await toggleMemberStatus(testMemberId);
    assert(toggleBackRes.success === true && toggleBackRes.member?.isActive === true, 'toggleMemberStatus mengubah kembali ke Aktif');

    const updateRes = await updateMember(testMemberId, {
      name: 'Anggota Test Updated',
      phone: '0811111111',
      notes: 'Updated notes',
    });
    assert(updateRes.success === true && updateRes.member?.name === 'Anggota Test Updated', 'updateMember berhasil mengedit data');

    // 3. Test Core Transaction Logic & Quick Input (Rp 5.000 & Multi-week)
    console.log('\n--- TEST 3: Core Transaction Logic (Rp 5.000 & Kelipatan) ---');
    // Pembayaran 1 minggu (W1 = Rp 5.000)
    const tx1Res = await recordCashPayment({
      memberId: testMemberId,
      paymentDate: '2026-09-05',
      weeks: [1],
      month: 9,
      year: 2026,
      notes: 'Uji kas 1 minggu',
    });
    assert(
      tx1Res.success === true && tx1Res.totalAmount === 5000 && tx1Res.count === 1,
      'recordCashPayment 1 minggu menghasilkan Rp 5.000'
    );

    // Pembayaran 2 minggu sekaligus (W2 & W3 = Rp 10.000)
    const tx2Res = await recordCashPayment({
      memberId: testMemberId,
      paymentDate: '2026-09-05',
      weeks: [2, 3],
      month: 9,
      year: 2026,
      notes: 'Uji kas 2 minggu kelipatan',
    });
    assert(
      tx2Res.success === true && tx2Res.totalAmount === 10000 && tx2Res.count === 2,
      'recordCashPayment multi-minggu [2, 3] otomatis mengkalkulasi Rp 10.000 (kelipatan)'
    );

    // Validasi Zod: Error jika data tidak valid
    const invalidRes = await recordCashPayment({
      memberId: testMemberId,
      paymentDate: '',
      weeks: [],
      month: 9,
      year: 2026,
    });
    assert(invalidRes.success === false, 'Zod validator menggagalkan input tanpa minggu dan tanggal kosong');

    // 4. Test Dashboard Data Aggregation & 0% Discrepancy (G-03)
    console.log('\n--- TEST 4: Aggregation Engine & 0% Discrepancy KPI (G-03) ---');
    const dashboard = await getDashboardData(9, 2026, null);
    assert(dashboard.success === true, 'getDashboardData berhasil dieksekusi');

    const totalFromTable = dashboard.transactions.reduce((s: number, t: any) => s + t.amount, 0);
    const totalFromWeeklyChart = dashboard.weeklyData.reduce((s: number, w: any) => s + w.totalAmount, 0);
    assert(
      totalFromTable === totalFromWeeklyChart,
      `Kesesuaian 0% selisih (G-03): Total Tabel (Rp ${totalFromTable}) === Total Grafik (Rp ${totalFromWeeklyChart})`
    );
    assert(
      dashboard.weeklyData.length === 5,
      'Grafik mingguan memuat 5 periode (Minggu 1 s/d Minggu 5)'
    );

    // Cleanup test member & its cascaded transactions
    await deleteMember(testMemberId);
    console.log('\nCleanup data pengujian selesai.');

  } catch (error) {
    console.error('Error saat menjalankan test suite:', error);
    failed++;
  }

  console.log('\n========================================');
  console.log(`HASIL AKHIR: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
