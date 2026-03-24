import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Connexion - Hasfy Docs',
  description: 'Connectez-vous à Hasfy Docs.',
};
export const dynamic = 'force-dynamic';
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à la documentation privée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Les comptes sont créés par l&apos;administrateur Hasfy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
