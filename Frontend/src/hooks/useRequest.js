import { useCallback, useState } from "react";

export default function useRequest(requestFn) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setStatus(null);
      try {
        const result = await requestFn(...args);
        setData(result.data);
        setStatus(result.status);
        return result;
      } catch (err) {
        setError(err.message || "Request failed");
        setStatus(err.status || 0);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [requestFn]
  );

  return { data, error, status, loading, execute };
}
