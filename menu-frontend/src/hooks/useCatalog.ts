import { useEffect, useState } from "react";
import { fetchCatalog } from "../api/catalogApi";

export function useCatalog() {
  const [catalog, setCatalog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Función para realizar la carga
    const loadData = () => {
      // Opcional: podrías no poner loading(true) aquí para que sea una
      // actualización "silenciosa" en el fondo sin que desaparezca el catálogo actual
      fetchCatalog()
        .then(setCatalog)
        .catch(console.error) // Siempre es bueno manejar errores
        .finally(() => setLoading(false));
    };

    // 2. Ejecución inmediata la primera vez
    loadData();

    // 3. Configurar el intervalo (30 segundos = 30000 ms)
    const interval = setInterval(loadData, 30000);

    // 4. LIMPIEZA: Muy importante para que no queden procesos
    // corriendo si el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  return { catalog, loading };
}
