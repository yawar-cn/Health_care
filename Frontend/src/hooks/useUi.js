import { useUiStore } from "../store/useUiStore";

export const useUi = () => {
  const loadingCount = useUiStore((state) => state.loadingCount);
  const globalError = useUiStore((state) => state.globalError);
  const clearError = useUiStore((state) => state.clearError);

  return { loadingCount, globalError, clearError };
};
