export const OTHER_CAMPAIGN = "Other / Not sure";

export type Campaign = {
  name: string;
  slug: string;
  icon: string;
  blurb: string;
};

export const CAMPAIGNS: Campaign[] = [
  { name: "Camp Lejeune", slug: "camp-lejeune", icon: "💧", blurb: "Water contamination claims for veterans and families stationed at Camp Lejeune." },
  { name: "AFFF Firefighting Foam", slug: "afff", icon: "🧯", blurb: "Firefighting foam exposure linked to cancer and serious health conditions." },
  { name: "Roundup", slug: "roundup", icon: "🌿", blurb: "Weedkiller exposure claims for non-Hodgkin lymphoma and related cancers." },
  { name: "Ozempic / GLP-1", slug: "ozempic-glp1", icon: "💉", blurb: "GLP-1 receptor agonist claims for gastroparesis and severe digestive injuries." },
  { name: "NEC Baby Formula", slug: "nec-formula", icon: "🍼", blurb: "Baby formula claims for necrotizing enterocolitis in premature infants." },
  { name: "Depo Provera", slug: "depo-provera", icon: "💊", blurb: "Contraceptive injection claims linked to meningioma brain tumors." },
  { name: "PFAS Forever Chemicals", slug: "pfas", icon: "⚗️", blurb: "Forever chemical contamination claims from drinking water and consumer products." },
  { name: "Suboxone", slug: "suboxone", icon: "🦷", blurb: "Sublingual film claims for severe dental decay and tooth loss." },
  { name: "Bard PowerPort", slug: "bard-powerport", icon: "🩺", blurb: "Implantable port catheter claims for device fracture and migration injuries." },
  { name: "Hair Relaxer", slug: "hair-relaxer", icon: "💇", blurb: "Chemical hair straightener claims linked to uterine cancer and fibroids." },
  { name: "Oxbryta", slug: "oxbryta", icon: "💊", blurb: "Sickle cell disease drug claims following market withdrawal for safety concerns." },
  { name: "Hernia Mesh", slug: "hernia-mesh", icon: "🩹", blurb: "Surgical mesh implant claims for chronic pain, infection, and mesh failure." },
  { name: "Zantac", slug: "zantac", icon: "💊", blurb: "Heartburn medication claims for cancer caused by NDMA contamination." },
  { name: "Dacthal", slug: "dacthal", icon: "🌾", blurb: "Pesticide exposure claims linked to thyroid damage and developmental harm." },
  { name: "Rideshare Assault", slug: "rideshare", icon: "🚗", blurb: "Assault and safety claims against rideshare companies for passenger injuries." },
  { name: "Risperdal", slug: "risperdal", icon: "💊", blurb: "Antipsychotic medication claims for gynecomastia and hormonal side effects." },
  { name: "Olympus Scope", slug: "olympus-scope", icon: "🔬", blurb: "Duodenoscope and endoscope infection claims including CRE superbug outbreaks and the 2025 MAJ-891 recall." },
  { name: "Social Media Addiction", slug: "social-media-addiction", icon: "📱", blurb: "MDL 3047 claims against Meta, TikTok, Snap, YouTube, and Discord for adolescent mental health harms — bellwether trials approaching." },
  { name: "Sports Betting Addiction", slug: "sports-betting", icon: "🎰", blurb: "Consumer protection claims against DraftKings, FanDuel, BetMGM, Caesars — predatory VIP targeting and self-exclusion failures." },
  { name: "Video Game Addiction", slug: "video-game-addiction", icon: "🎮", blurb: "Roblox, Fortnite, and loot-box claims — variable-reinforcement design defects and unauthorized child microtransactions." },
  { name: "Roblox", slug: "roblox", icon: "🕹️", blurb: "Child-safety claims on the Roblox platform — grooming, exploitation, and deceptive design harms to minors." },
  { name: "Benzene Exposure", slug: "benzene-exposure", icon: "⚠️", blurb: "Occupational and consumer-product benzene claims — AML, CML, NHL, MDS from refinery work or recalled sunscreens, antiperspirants, and dry shampoos." },
  { name: "Talcum Powder", slug: "talcum-powder", icon: "💄", blurb: "Johnson & Johnson talc claims linked to ovarian cancer and mesothelioma — MDL 2738, active in 2026." },
  { name: "Tepezza", slug: "tepezza", icon: "💉", blurb: "Thyroid eye disease infusion claims for permanent hearing loss and tinnitus — MDL 3079." },
  { name: "Taxotere", slug: "taxotere", icon: "💉", blurb: "Docetaxel chemotherapy claims for permanent hair loss and tear-duct eye injuries — MDL 2740/3023." },
  { name: "Silicosis", slug: "silicosis", icon: "🏗️", blurb: "Engineered-stone countertop worker claims for silicosis — 560+ confirmed CA cases, early-stage litigation with plaintiff verdicts." },
  { name: "Paraquat", slug: "paraquat", icon: "🌾", blurb: "Herbicide exposure claims for Parkinson's disease — MDL 3004, ~6,600 federal plaintiffs, new claims still filed in 2026." },
  { name: "Paragard", slug: "paragard", icon: "🔧", blurb: "Copper IUD breakage claims for surgical retrieval and related injuries — MDL 2974, ~4,000 federal cases." },
  { name: "Wildfire", slug: "wildfire", icon: "🔥", blurb: "Eaton and Palisades fire claims against Southern California Edison — SOL deadlines begin January 2027." },
  { name: "IVC Filter", slug: "ivc-filter", icon: "🩺", blurb: "Retrievable vena cava filter claims for fracture, migration, and perforation — Cook MDL 2570, ~6,500 cases pending and still open." },
  { name: "Mesothelioma", slug: "mesothelioma", icon: "🏭", blurb: "Asbestos exposure claims for mesothelioma and lung cancer — state court dockets plus 60+ bankruptcy trusts holding $30B+." },
  { name: "Allergan Breast Implant", slug: "allergan-breast-implant", icon: "🩺", blurb: "Recalled BIOCELL textured implant claims for BIA-ALCL and explant surgery — MDL 2921, first bellwether October 2026." },
  { name: "Valsartan", slug: "valsartan", icon: "💊", blurb: "NDMA-contaminated blood pressure medication claims for cancer — MDL 2875, personal injury track still in active litigation." },
  { name: "Exactech", slug: "exactech", icon: "🦴", blurb: "Recalled knee, hip, and ankle implant claims for revision surgery — MDL 3044, currently stayed by Chapter 11 bankruptcy." },
  { name: "Philips CPAP", slug: "philips-cpap", icon: "😴", blurb: "PE-PUR foam degradation claims from recalled sleep devices — MDL 3014, settlement registration closed January 2025." },
  { name: "Motor Vehicle Accidents", slug: "motor-vehicle", icon: "🚗", blurb: "Exclusive motor vehicle accident leads — live transfers, qualified forms, and data leads with TCPA and DPPA compliance baked in." },
  { name: "Transvaginal Mesh (TVM)", slug: "transvaginal-mesh", icon: "🩺", blurb: "Pelvic mesh erosion, chronic pain, and revision-surgery claims from POP and SUI implants." },
  { name: "Premises Liability", slug: "premises-liability", icon: "🏢", blurb: "Slip and fall, negligent security, and dangerous-condition claims against property owners." },
  { name: "CA Juvenile Detention Abuse", slug: "ca-juvenile-detention-abuse", icon: "⚖️", blurb: "Survivors of staff sexual abuse in California juvenile halls and probation camps, under the AB 218 revival window." },
  { name: "CA Women's Prison Abuse", slug: "ca-womens-prison-abuse", icon: "⚖️", blurb: "Women sexually abused by correctional staff in California state and federal women's facilities." },
  { name: "WTC / 9-11", slug: "wtc", icon: "🏙️", blurb: "World Trade Center victim compensation claims for responders and survivors — VCF awards and Zadroga Act health benefits." },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function matchCampaign(param: string | undefined | null): Campaign | null {
  if (!param) return null;
  const n = norm(param);
  if (!n) return null;
  if (n === norm(OTHER_CAMPAIGN) || n === "other" || n === "notsure") {
    return { name: OTHER_CAMPAIGN, slug: "other", icon: "❓", blurb: "" };
  }
  return CAMPAIGNS.find((c) => norm(c.name) === n || norm(c.slug) === n) ?? {
    name: OTHER_CAMPAIGN,
    slug: "other",
    icon: "❓",
    blurb: "",
  };
}
