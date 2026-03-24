import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCS_PATH = path.join(process.cwd(), 'docs');

export interface DocMetadata {
  title: string;
  description?: string;
  tags?: string[];
  order?: number;
}

export interface DocWithContent extends DocMetadata {
  slug: string;
  content: string;
}

export interface DocNavItem {
  title: string;
  slug: string;
  order: number;
}

export function getDocFiles(visibility: 'public' | 'private'): string[] {
  const docsDir = path.join(DOCS_PATH, visibility);

  if (!fs.existsSync(docsDir)) {
    return [];
  }

  const results: string[] = [];

  function walk(dir: string, prefix: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        results.push(prefix ? `${prefix}/${entry.name}` : entry.name);
      }
    }
  }

  walk(docsDir, '');
  return results;
}

export function getDocBySlug(
  slug: string,
  visibility: 'public' | 'private'
): DocWithContent | null {
  try {
    const mdxPath = path.join(DOCS_PATH, visibility, `${slug}.mdx`);
    const mdPath = path.join(DOCS_PATH, visibility, `${slug}.md`);

    const finalPath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

    if (!fs.existsSync(finalPath)) {
      return null;
    }

    const fileContent = fs.readFileSync(finalPath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || slug,
      description: data.description,
      tags: data.tags,
      order: data.order || 0,
      content,
    };
  } catch (error) {
    console.error(`Error reading doc ${slug}:`, error);
    return null;
  }
}

export function getAllDocs(visibility: 'public' | 'private'): DocWithContent[] {
  const files = getDocFiles(visibility);

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, '');
      return getDocBySlug(slug, visibility);
    })
    .filter((doc): doc is DocWithContent => doc !== null)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getDocNavigation(
  visibility: 'public' | 'private'
): DocNavItem[] {
  const docs = getAllDocs(visibility);

  return docs.map((doc) => ({
    title: doc.title,
    slug: doc.slug,
    order: doc.order || 0,
  }));
}
