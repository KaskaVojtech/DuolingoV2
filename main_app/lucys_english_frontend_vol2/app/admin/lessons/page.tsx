import { LessonList } from '@/components/admin/lessons/LessonList';

export default function AdminLessonsPage() {
  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Lekce</h1>
        <p className="admin-page-sub">Správa lekcí a slovíček</p>
      </div>
      <LessonList />
    </div>
  );
}
