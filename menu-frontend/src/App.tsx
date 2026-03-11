import { useCatalog } from "./hooks/useCatalog";

export default function App() {
  const { catalog, loading } = useCatalog();

  if (loading) return <div>Cargando menú...</div>;
  if (!catalog) return <div>Sin catálogo</div>;

  return (
    <main>
      <h1>Menú</h1>
      {catalog.products.map((product: any) => (
        <article key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </article>
      ))}
    </main>
  );
}
