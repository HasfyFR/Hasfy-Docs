import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Gestion docs - Hasfy Docs',
  description: 'Gestion de la documentation Hasfy.',
};

export const dynamic = 'force-dynamic';

export default function AdminDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Gestion de la documentation</h1>
        </div>
      </header>

      <main className="container py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Documents</CardTitle>
            </div>
            <CardDescription>
              Fonctionnalité CRUD de documentation à implémenter.
              Les documents sont actuellement gérés via les fichiers MDX dans le dossier content/ et docs/.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
