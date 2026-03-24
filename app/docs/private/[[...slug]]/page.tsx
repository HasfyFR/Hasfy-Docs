import { notFound } from 'next/navigation';
import { getDocBySlug, getAllDocs } from '@/lib/mdx';
import { MDXContent } from '@/components/mdx/mdx-content';
import { DocNav } from '@/components/docs/doc-nav';
import { Breadcrumbs } from '@/components/docs/breadcrumbs';

export const metadata = {
  title: 'Documentation privée - Hasfy Docs',
  description: 'Documentation privée Hasfy.',
};

export const dynamic = 'force-dynamic';

interface PrivateDocPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function PrivateDocPage({ params }: PrivateDocPageProps) {
  const { slug } = await params;
  const docSlug = slug?.join('/') || 'architecture';

  const doc = getDocBySlug(docSlug, 'private');
  if (!doc) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-2xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <DocNav visibility="private" currentSlug={docSlug} />
          </aside>

          <main className="flex-1 min-w-0">
            <Breadcrumbs
              items={[
                { label: 'Documentation', href: '/' },
                { label: 'Privée', href: '/docs/private' },
                { label: doc.title, href: `/docs/private/${doc.slug}` },
              ]}
            />
            <div className="mt-6">
              <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-yellow-100 dark:bg-yellow-950 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                Documentation privée
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{doc.title}</h1>
              {doc.description && (
                <p className="text-lg text-muted-foreground mb-8">{doc.description}</p>
              )}
              <MDXContent source={doc.content} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const docs = getAllDocs('private');
  return docs.map((doc) => ({ slug: doc.slug.split('/') }));
}
