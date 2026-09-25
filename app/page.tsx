import { matchCampaign } from "@/lib/campaigns";
import { LanderClient } from "./lander-client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.campaign;
  const campaign = matchCampaign(Array.isArray(raw) ? raw[0] : raw);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <LanderClient initialCampaign={campaign?.name ?? ""} />
      <SiteFooter />
    </main>
  );
}
