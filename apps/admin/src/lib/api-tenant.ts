export async function getHotelBranding(slug: string) {
  const res = await fetch(`http://localhost:3000/tenant-test/debug`, {
    headers: {
      'x-tenant-slug': slug,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.data_en_request;
}