-- ============================================
-- Storage Policies for Hasfy Docs
-- ============================================
-- Run this AFTER creating the buckets in Supabase Dashboard:
-- 1. docs-public (public)
-- 2. docs-private (private)
-- 3. assets (public)

-- docs-public: anyone can read
CREATE POLICY "Public docs are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'docs-public');

CREATE POLICY "Admins can upload to docs-public"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'docs-public'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- docs-private: only authenticated users
CREATE POLICY "Authenticated users can view private docs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'docs-private' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can upload to docs-private"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'docs-private'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- assets: anyone can read, admins can upload
CREATE POLICY "Assets are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assets');

CREATE POLICY "Admins can upload assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assets'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );
