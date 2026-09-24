/**
 * Procedural paper-crumple sound — filtered noise bed + random crackle
 * transients, generated with Web Audio. No audio assets needed.
 * Must be called from a user-gesture context (submit handler qualifies).
 */
export function playCrumpleSound(durationMs = 1600): void {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const dur = durationMs / 1000;
    const t0 = ctx.currentTime + 0.05;
    const rate = ctx.sampleRate;

    // Noise bed — amplitude swells through the gather, peaks at the crush.
    const len = Math.floor(rate * dur);
    const bed = ctx.createBuffer(1, len, rate);
    const bedData = bed.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      const env = Math.sin(Math.PI * Math.min(1, t * 1.12));
      bedData[i] = (Math.random() * 2 - 1) * env;
    }
    const bedSrc = ctx.createBufferSource();
    bedSrc.buffer = bed;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1700;
    band.Q.value = 0.7;
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 5200;
    const bedGain = ctx.createGain();
    bedGain.gain.setValueAtTime(0.0001, t0);
    bedGain.gain.exponentialRampToValueAtTime(0.2, t0 + dur * 0.3);
    bedGain.gain.setValueAtTime(0.2, t0 + dur * 0.68);
    bedGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    bedSrc.connect(band).connect(low).connect(bedGain).connect(ctx.destination);
    bedSrc.start(t0);

    // Crackle bursts — short, bright noise pops scattered through the motion.
    for (let t = 0.08; t < dur - 0.12; t += 0.035 + Math.random() * 0.085) {
      const cLen = Math.floor(rate * 0.02);
      const cb = ctx.createBuffer(1, cLen, rate);
      const cd = cb.getChannelData(0);
      for (let i = 0; i < cLen; i++) {
        cd[i] = (Math.random() * 2 - 1) * Math.exp(-i / (cLen * 0.28));
      }
      const cs = ctx.createBufferSource();
      cs.buffer = cb;
      const cbp = ctx.createBiquadFilter();
      cbp.type = "bandpass";
      cbp.frequency.value = 1400 + Math.random() * 3200;
      cbp.Q.value = 2.6;
      const cg = ctx.createGain();
      cg.gain.value = 0.08 + Math.random() * 0.2;
      cs.connect(cbp).connect(cg).connect(ctx.destination);
      cs.start(t0 + t);
    }

    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, (dur + 0.4) * 1000);
  } catch {
    /* audio unavailable — silent is fine */
  }
}
