
import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("_id");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return [lat, lng, id];
}