export type IntakeDocData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
  campaign: string;
  description: string;
};

const INK = "#2a2620";
const FAINT = "#8a8274";
const RULE = "#cfc8b8";
const GOLD = "#a8894a";

function truncate(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + "…").width > maxWidth) t = t.slice(0, -1);
  return t + "…";
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): number {
  const words = text.split(/\s+/).filter(Boolean);
  let line = "";
  let lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(lines === maxLines - 1 ? truncate(ctx, line + " " + word, maxWidth) : line, x, y);
      y += lineHeight;
      lines++;
      line = word;
      if (lines >= maxLines) return y;
    } else {
      line = test;
    }
  }
  if (line && lines < maxLines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

/**
 * Draws a personalized "Case Review Request" intake document onto a canvas and
 * returns it as a PNG data URL — used as the PaperCrumple texture so the sheet
 * that crumples away looks like the victim's actual submission.
 */
export function createIntakeDocImage(d: IntakeDocData): string {
  const W = 560;
  const H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Paper
  ctx.fillStyle = "#f5f1e8";
  ctx.fillRect(0, 0, W, H);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(0,0,0,0.05)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const M = 52;
  const CW = W - M * 2;
  let y = 64;

  // Letterhead
  ctx.fillStyle = INK;
  ctx.font = "700 22px Georgia, 'Times New Roman', serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("TortsLinks", M, y);
  ctx.font = "600 10px Arial, sans-serif";
  ctx.fillStyle = FAINT;
  ctx.textAlign = "right";
  ctx.fillText("C O N F I D E N T I A L", W - M, y - 8);
  ctx.fillText("tortslink.com", W - M, y + 6);
  ctx.textAlign = "left";

  y += 18;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(M, y);
  ctx.lineTo(W - M, y);
  ctx.stroke();

  // Title
  y += 44;
  ctx.fillStyle = INK;
  ctx.font = "600 26px Georgia, serif";
  ctx.fillText("Free Case Review Request", M, y);
  y += 22;
  ctx.font = "12px Arial, sans-serif";
  ctx.fillStyle = FAINT;
  ctx.fillText(
    `Submitted ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    M,
    y
  );

  // Fields
  const field = (label: string, value: string) => {
    y += 46;
    ctx.font = "600 9px Arial, sans-serif";
    ctx.fillStyle = FAINT;
    ctx.fillText(label.toUpperCase(), M, y);
    y += 20;
    ctx.font = "15px Georgia, serif";
    ctx.fillStyle = INK;
    ctx.fillText(truncate(ctx, value || "—", CW - 8), M, y);
    y += 12;
    ctx.strokeStyle = RULE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(M, y);
    ctx.lineTo(W - M, y);
    ctx.stroke();
  };

  const name = `${d.firstName} ${d.lastName}`.trim();
  field("Claimant name", name);
  field("Phone", d.phone);
  field("Email", d.email);
  field("ZIP code", d.zip);
  field("Campaign", d.campaign);

  // Description box
  y += 46;
  ctx.font = "600 9px Arial, sans-serif";
  ctx.fillStyle = FAINT;
  ctx.fillText("BRIEF DESCRIPTION", M, y);
  y += 20;
  ctx.font = "13px Georgia, serif";
  ctx.fillStyle = INK;
  if (d.description.trim()) {
    y = wrapText(ctx, d.description.trim(), M, y, CW, 19, 3);
  } else {
    ctx.fillStyle = "#b3ab99";
    ctx.fillText("—", M, y);
    y += 19;
  }

  // Signature line
  y = H - 128;
  ctx.strokeStyle = RULE;
  ctx.beginPath();
  ctx.moveTo(M, y);
  ctx.lineTo(M + 220, y);
  ctx.stroke();
  ctx.font = "italic 16px Georgia, serif";
  ctx.fillStyle = "#4a5568";
  ctx.fillText(name || "Claimant", M + 8, y - 8);
  ctx.font = "600 9px Arial, sans-serif";
  ctx.fillStyle = FAINT;
  ctx.fillText("SIGNATURE", M, y + 16);

  // Gold seal
  const sx = W - M - 46;
  const sy = H - 116;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(sx, sy, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sx, sy, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.font = "700 18px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("TL", sx, sy + 6);
  ctx.textAlign = "left";

  // Footer
  ctx.font = "9px Arial, sans-serif";
  ctx.fillStyle = FAINT;
  ctx.fillText(
    "Attorney advertising. Confidential intake — not an attorney-client relationship.",
    M,
    H - 40
  );

  // Paper grain — faint speckle so the surface doesn't read as flat CG.
  for (let i = 0; i < 2600; i++) {
    const a = Math.random() * 0.05;
    ctx.fillStyle =
      Math.random() > 0.5 ? `rgba(60,50,35,${a})` : `rgba(255,255,255,${a})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }

  // Edge vignette — light falls off toward the borders like real paper.
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.78);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(45,35,18,0.13)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  return canvas.toDataURL("image/png");
}
