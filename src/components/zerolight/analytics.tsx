"use client";

import React, { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { track as vercelTrack } from "@vercel/analytics";
import posthog from "posthog-js";

let posthogReady = false;

/**
 * Unified ZeroLight analytics component: mounts Vercel Web Analytics
 * and initializes PostHog when NEXT_PUBLIC_POSTHOG_KEY is configured.
 */
export function ZeroLightAnalytics() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthogReady) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });
    posthogReady = true;
  }, []);

  return <Analytics />;
}

/**
 * Track component usage, CLI copies, Morphic stage switches, and search events
 * across Vercel Analytics and PostHog without blocking UI interactions.
 */
export function trackZeroLightEvent(
  eventName: string,
  props: Record<string, string | number | boolean> = {}
) {
  try {
    vercelTrack(eventName, props);
  } catch {
    // Non-blocking fallback when analytics is disabled
  }

  try {
    if (posthogReady) {
      posthog.capture(eventName, props);
    }
  } catch {
    // Ignore client-side blockers
  }
}
