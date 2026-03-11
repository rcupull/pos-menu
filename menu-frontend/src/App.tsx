import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "./hooks/useCatalog";

const SLIDE_DURATION_MS = 3000;

function formatPrice(price: number, currency?: string) {
  if (currency === "USD") return `$${Number(price).toFixed(0)}`;
  return `${Number(price).toFixed(0)} ${currency ?? ""}`.trim();
}

export default function App() {
  const { catalog, loading } = useCatalog();
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = useMemo(() => catalog?.products ?? [], [catalog]);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(interval);
  }, [products]);

  if (loading || !catalog || products.length === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-white">
        <span className="text-3xl font-semibold">
          {loading ? "Cargando menú..." : "Sin catálogo"}
        </span>
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      {/* MAPEO DE SLIDES COMPLETOS */}
      {products.map((product: any, index: number) => (
        <div
          key={product.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full object-cover mx-auto"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* 3. Contenido de Texto */}
          <div className="absolute inset-0 flex flex-col px-[5vw] py-[5vh]">
            <h1 className="max-w-[12ch] text-[clamp(3rem,6vw,6.5rem)] font-extrabold leading-none text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]">
              {product.name}
            </h1>

            <div className="mt-8 text-[clamp(3rem,7vw,7rem)] font-black leading-none text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              {formatPrice(product.price, product.currency)}
            </div>
          </div>
        </div>
      ))}

      {/* INDICADORES (Fuera del loop de slides para que sean estáticos) */}
      <div className="absolute bottom-[5vh] left-0 right-0 z-20 flex justify-center">
        <div className="flex items-center gap-3">
          {products.map((_: any, index: number) => (
            <div
              key={`dot-${index}`}
              className={`h-2 rounded-full bg-white transition-all duration-500 ${
                index === currentIndex ? "w-12 opacity-100" : "w-8 opacity-30"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
