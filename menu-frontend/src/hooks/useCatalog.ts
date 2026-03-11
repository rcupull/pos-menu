import { useEffect, useState } from "react";
import { fetchCatalog } from "../api/catalogApi";

export function useCatalog() {
  const [catalog, setCatalog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalog()
      .then(setCatalog)
      .finally(() => setLoading(false));
  }, []);

  return { catalog, loading };
}
