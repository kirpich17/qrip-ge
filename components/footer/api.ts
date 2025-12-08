export const FooterInfo = async () => {
  const res = await fetch(`http://localhost:4040/api/footerInfo`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};
