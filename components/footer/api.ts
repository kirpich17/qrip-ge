const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const FooterInfo = async () => {
  const res = await fetch(`${baseUrl}api/footerInfo`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};
