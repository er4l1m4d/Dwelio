## Supabase Storage Buckets (Phase 0.6)

Create two buckets:
- `property-images` — Public ON
- `property-videos` — Public ON

Run the policies below in Supabase SQL Editor (or create the same policies in the UI).

```sql
-- Allow authenticated uploads to property-images
create policy "property_images_insert_authenticated"
on storage.objects for insert
to authenticated
with check (bucket_id = 'property-images');

-- Allow authenticated uploads to property-videos
create policy "property_videos_insert_authenticated"
on storage.objects for insert
to authenticated
with check (bucket_id = 'property-videos');

-- Optional: allow public read access (buckets are Public ON, so this is usually not required)
create policy "property_images_public_read"
on storage.objects for select
to public
using (bucket_id = 'property-images');

create policy "property_videos_public_read"
on storage.objects for select
to public
using (bucket_id = 'property-videos');
```
