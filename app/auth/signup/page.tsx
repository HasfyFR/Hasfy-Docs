import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Inscription - Hasfy Docs',
  description: 'L\'inscription est gérée par l\'administrateur.',
};

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  redirect('/auth/login');
}
