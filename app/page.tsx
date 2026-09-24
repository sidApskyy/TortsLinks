import { matchCampaign } from "@/lib/campaigns";
import { LanderClient } from "./lander-client";
import { SiteHeader } from "@/components/site-header";

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

      <footer className="border-t border-white/10 bg-black text-white/70">
        <div className="mx-auto max-w-6xl px-5 pt-12 pb-28 lg:pb-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <a href="/" className="font-display text-2xl font-bold tracking-tight text-white">
                Torts<span className="text-accent">Links</span>
              </a>
              <p className="mt-4 max-w-sm text-sm text-white/60">
                Where Better Cases Begin With Better Acquisition.
              </p>
              <div className="mt-4 space-y-1 text-sm">
                <a
                  href="mailto:hello@thetortsattorney.com"
                  className="block text-white/70 hover:text-accent"
                >
                  hello@thetortsattorney.com
                </a>
                <a href="tel:3025868230" className="block text-white/70 hover:text-accent">
                  3025868230
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Navigation</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                <li><a href="/#campaigns" className="hover:text-accent">Campaigns</a></li>
                <li><a href="/#how-it-works" className="hover:text-accent">How It Works</a></li>
                <li><a href="/#faq" className="hover:text-accent">FAQ</a></li>
                <li><a href="/#victim-form" className="hover:text-accent">Free Case Review</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                <li><a href="#privacy" className="hover:text-accent">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-accent">Terms of Service</a></li>
                <li><a href="#disclosures" className="hover:text-accent">Disclosures</a></li>
                <li><a href="#cookie-policy" className="hover:text-accent">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/15 pt-8 text-sm text-white/55">
            <h3 className="font-semibold text-white/80">Important Notice</h3>
            <p className="mt-2 max-w-3xl">
              We provide legal marketing and case-acquisition services for plaintiff law firms and
              campaign partners. We are not a law firm and do not provide legal advice or legal
              representation.
            </p>
          </div>

          <div className="mt-8 space-y-6 border-t border-white/15 pt-8 text-sm leading-relaxed text-white/50">
            <div id="privacy" className="scroll-mt-24">
              <h3 className="font-semibold text-white/80">Privacy Policy</h3>
              <p className="mt-2">
                Information you submit is used to evaluate your potential claim and may be shared
                with participating law firms for that purpose. We do not sell your information for
                unrelated marketing. You may request access to or deletion of your information at
                any time by contacting us.
              </p>
            </div>
            <div id="terms" className="scroll-mt-24">
              <h3 className="font-semibold text-white/80">Terms of Service</h3>
              <p className="mt-2">
                By using this site you agree that your submission is a request for a free case
                review only, that no attorney-client relationship is formed, and that you consent to
                be contacted as described in the consent language presented with the form.
              </p>
            </div>
            <div id="disclosures" className="scroll-mt-24">
              <h3 className="font-semibold text-white/80">Disclosures</h3>
              <p className="mt-2">
                This is a paid attorney advertisement. Participating attorneys and firms pay to
                receive qualifying inquiries. The choice of a lawyer is an important decision and
                should not be based solely upon advertisements. Prior results do not guarantee
                similar outcomes.
              </p>
            </div>
            <div id="cookie-policy" className="scroll-mt-24">
              <h3 className="font-semibold text-white/80">Cookie Policy</h3>
              <p className="mt-2">
                This site uses only technologies required for security and form functionality,
                including bot-mitigation and consent-certification tools. We do not use advertising
                or analytics cookies on this page.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm text-white/40">
            © {new Date().getFullYear()} The Torts Attorney. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
