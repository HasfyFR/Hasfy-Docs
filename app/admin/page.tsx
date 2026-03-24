import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, FileText, Shield, User, GitBranch } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Admin - Hasfy Docs',
  description: 'Dashboard d\'administration Hasfy.',
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/admin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const isSuperAdmin = user.email?.endsWith('@hasfy.fr') || false;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Administration</h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{profile?.full_name || user.email}</span>
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                <Shield className="h-3 w-3" />
                Super Admin
              </span>
            )}
            <Link href="/" className="text-sm text-primary hover:underline">
              Retour à la documentation
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Tableau de bord</h2>
          <p className="text-muted-foreground">
            Gérez votre profil et {isSuperAdmin ? 'administrez la plateforme' : 'accédez à vos paramètres'}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Profil utilisateur</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <Link href="/admin/profile" className="block h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>Mon profil</CardTitle>
                  </div>
                  <CardDescription>Modifiez votre nom, photo et informations personnelles</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Administration</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <Link href="/admin/docs" className="block h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                      <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle>Documentation</CardTitle>
                  </div>
                  <CardDescription>Gérer les articles et la documentation</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <Link href="/admin/github" className="block h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-950">
                      <GitBranch className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <CardTitle>GitHub</CardTitle>
                  </div>
                  <CardDescription>Intégration et synchronisation GitHub</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            {isSuperAdmin && (
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <Link href="/admin/users" className="block h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle>Utilisateurs</CardTitle>
                    </div>
                    <CardDescription>Gérer les utilisateurs et les rôles</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
