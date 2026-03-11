const endpointUrl = "http://localhost:4000/api";

export async function fetchCatalog() {
  const res = await fetch(`${endpointUrl}/menu/catalog`);
  if (!res.ok) {
    throw new Error("Failed to load catalog");
  }
  return res.json();
}
