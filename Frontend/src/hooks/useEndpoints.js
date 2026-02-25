import { useMemo } from "react";
import { services, getTotalEndpoints } from "../services/endpoints";

export default function useEndpoints() {
  const totalEndpoints = useMemo(() => getTotalEndpoints(), []);
  return { services, totalEndpoints };
}
