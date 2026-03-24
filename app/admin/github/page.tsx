import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

export const metadata = {
  title: 'GitHub - Hasfy Docs',
  description: 'Intégration GitHub Hasfy.',
};

export const dynamic = 'force-dynamic';

export default function AdminGithubPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Intégration GitHub</h1>
        </div>
      </header>

      <main className="container py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-muted-foreground" />
              <CardTitle>GitHub</CardTitle>
            </div>
            <CardDescription>
              Synchronisation et intégration GitHub à implémenter.
              Cette page permettra de configurer le lien avec un dépôt GitHub pour la synchronisation du contenu.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
