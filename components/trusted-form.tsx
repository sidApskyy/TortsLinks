"use client";

import { useEffect } from "react";

export function TrustedFormScript() {
  useEffect(() => {
    if (document.querySelector('script[src*="trustedform.js"]')) return;
    const tf = document.createElement("script");
    tf.type = "text/javascript";
    tf.async = true;
    tf.src =
      "https://api.trustedform.com/trustedform.js" +
      "?field=xxTrustedFormCertUrl&provide_token=true&use_tagged_consent=true&l=" +
      Date.now() +
      Math.random();
    document.body.appendChild(tf);
  }, []);

  return (
    <>
      <input type="hidden" name="xxTrustedFormCertUrl" />
      <input type="hidden" name="xxTrustedFormToken" />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://api.trustedform.com/ns.gif" alt="" />
      </noscript>
    </>
  );
}
