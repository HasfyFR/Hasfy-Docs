import Link from 'next/link';
import { getDocNavigation, type DocNavItem } from '@/lib/mdx';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

interface DocNavProps {
  visibility: 'public' | 'private';
  currentSlug?: string;
}

const PROJECT_LABELS: Record<string, string> = {
  'hasfy-app': 'Hasfy App',
  'hasfy-agent': 'Hasfy Agent',
  'hasfy-infra': 'Hasfy Infra',
  'hasfy-lp': 'Hasfy LP',
  'hasfy-remotion': 'Hasfy Remotion',
};

function groupByProject(items: DocNavItem[]) {
  const groups: Record<string, DocNavItem[]> = {};
  const root: DocNavItem[] = [];

  for (const item of items) {
    const slashIndex = item.slug.indexOf('/');
    if (slashIndex !== -1) {
      const project = item.slug.substring(0, slashIndex);
      if (!groups[project]) groups[project] = [];
      groups[project].push(item);
    } else {
      root.push(item);
    }
  }

  return { groups, root };
}

export async function DocNav({ visibility, currentSlug }: DocNavProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const privateItems = user ? getDocNavigation('private') : [];

  if (!user || privateItems.length === 0) return null;

  const { groups, root } = groupByProject(privateItems);

  return (
    <nav className="sticky top-20 space-y-1">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-foreground">
        <Lock className="h-4 w-4" />
        Documentation privée
      </div>

      {root.map((item) => (
        <Link
          key={item.slug}
          href={`/docs/private/${item.slug}`}
          className={cn(
            'block px-3 py-2 rounded-md text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            currentSlug === item.slug
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}

      {Object.entries(groups).map(([project, items]) => (
        <div key={project} className="pt-3">
          <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {PROJECT_LABELS[project] || project}
          </div>
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/docs/private/${item.slug}`}
              className={cn(
                'block px-3 py-1.5 pl-5 rounded-md text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                currentSlug === item.slug
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
