import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Torts Attorney — Free Case Review",
    short_name: "Torts Link",
    description: "Free, confidential case review.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#0A0A0A",
    icons: [{ src: "/TTA_2@4x.webp", sizes: "512x512", type: "image/webp" }],
  };
}
