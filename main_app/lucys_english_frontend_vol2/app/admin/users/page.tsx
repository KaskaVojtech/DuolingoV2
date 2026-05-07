import { UserList } from '@/components/admin/users/UserList';

export default function AdminUsersPage() {
  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Uživatelé</h1>
        <p className="admin-page-sub">Správa uživatelů a přiřazování kurzů</p>
      </div>
      <UserList />
    </div>
  );
}
