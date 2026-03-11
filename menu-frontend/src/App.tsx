import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "./hooks/useCatalog";

const SLIDE_DURATION_MS = 6000;

function formatPrice(price: number, currency?: string) {
  if (currency === "USD") return `$${Number(price).toFixed(0)}`;
  return `${Number(price).toFixed(0)} ${currency ?? ""}`.trim();
}

export default function App() {
  const { catalog, loading } = useCatalog();
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = useMemo(() => catalog?.products ?? [], [catalog]);
  const currentProduct = products[currentIndex];

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(interval);
  }, [products]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-white">
        <span className="text-3xl font-semibold">Cargando menú...</span>
      </div>
    );
  }

  if (!catalog || products.length === 0 || !currentProduct) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-white">
        <span className="text-3xl font-semibold">Sin catálogo</span>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <section
        className="relative h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: currentProduct.imageUrl
            ? `url(${currentProduct.imageUrl})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-black/75" />

        <div className="relative z-10 flex h-full flex-col justify-between px-[5vw] py-[5vh]">
          <div className="max-w-[70vw]">
            <div className="mb-6 inline-flex rounded-full bg-white/15 px-5 py-2 text-lg font-bold tracking-[0.2em] text-white backdrop-blur-sm">
              MENÚ
            </div>

            <h1 className="max-w-[12ch] text-[clamp(3rem,6vw,6.5rem)] font-extrabold leading-none text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]">
              {currentProduct.name}
            </h1>

            {currentProduct.description ? (
              <p className="mt-5 max-w-3xl text-[clamp(1.1rem,1.8vw,2rem)] leading-snug text-white/90 drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
                {currentProduct.description}
              </p>
            ) : null}

            <div className="mt-8 text-[clamp(3rem,7vw,7rem)] font-black leading-none text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.75)]">
              {formatPrice(currentProduct.price, currentProduct.currency)}
            </div>
          </div>

          <div className="relative z-10 flex justify-center">
            <div className="flex items-center gap-3">
              {products.map((product: any, index: number) => (
                <div
                  key={product.id}
                  className={[
                    "h-2 rounded-full bg-white transition-all duration-300",
                    index === currentIndex
                      ? "w-12 opacity-100"
                      : "w-8 opacity-35",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
