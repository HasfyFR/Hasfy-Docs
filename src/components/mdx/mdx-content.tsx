import { MDXRemote } from 'next-mdx-remote/rsc';
import { Alert } from '@/components/mdx/alert';
import { CodeBlock } from '@/components/mdx/code-block';
import { Steps } from '@/components/mdx/steps';

const components = {
  Alert,
  CodeBlock,
  Steps,
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
