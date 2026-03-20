import { RegionsClient } from "@/components/regions/RegionsClient";
import { getAIPredictions } from "@/lib/api/prediction";
import { REGIONS } from "@/lib/data/regions";
import { enrichRegion } from "@/lib/utils/bloom";

export const revalidate = 10800;

export default async function RegionsPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const regions = REGIONS.map((r) => enrichRegion(r, today));
  const predictions = await getAIPredictions(regions);

  return <RegionsClient predictions={predictions} />;
}
