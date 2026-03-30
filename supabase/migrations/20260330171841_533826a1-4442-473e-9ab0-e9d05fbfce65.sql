
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Allow authenticated users to read avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow admins to upload avatars
CREATE POLICY "Admins can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update avatars
CREATE POLICY "Admins can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete avatars
CREATE POLICY "Admins can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND public.has_role(auth.uid(), 'admin')
);
