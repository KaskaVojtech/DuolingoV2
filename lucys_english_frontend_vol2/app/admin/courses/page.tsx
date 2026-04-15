import { CourseList } from '@/components/admin/courses/CourseList';

export default function AdminCoursesPage() {
  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Kurzy</h1>
        <p className="admin-page-sub">Správa kurzů a lekcí</p>
      </div>
      <CourseList />
    </div>
  );
}