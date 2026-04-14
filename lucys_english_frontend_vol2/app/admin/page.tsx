import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-sub">Vítejte v administraci</p>
      </div>

      <div className="admin-cards-grid">
        <Link href="/admin/lessons" className="admin-dashboard-card">
          <div className="admin-dashboard-card-icon">📚</div>
          <h3>Lekce</h3>
          <p>Vytvářejte a spravujte lekce a slovíčka</p>
        </Link>

        <Link href="/admin/courses" className="admin-dashboard-card admin-dashboard-card-blue">
          <div className="admin-dashboard-card-icon">🎓</div>
          <h3>Kurzy</h3>
          <p>Sestavujte kurzy z připravených lekcí</p>
        </Link>
      </div>
    </div>
  );
}
