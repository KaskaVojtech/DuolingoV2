/**
 * Entry page redirecting to the administration.
 */
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/admin/login');
}
