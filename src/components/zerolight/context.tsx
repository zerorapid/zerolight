"use client";

import React, { createContext, useContext, useMemo, useEffect } from "react";
import {
  ZeroLightTokens,
  DEFAULT_TOKENS,
  ScaledTokens,
  computeScaledTokens,
} from "./types";

interface ZeroLightContextValue {
  tokens: ZeroLightTokens;
  scaled: ScaledTokens;
  updateTokens?: (updates: Partial<ZeroLightTokens>) => void;
}

const ZeroLightContext = createContext<ZeroLightContextValue>({
  tokens: DEFAULT_TOKENS,
  scaled: computeScaledTokens(DEFAULT_TOKENS),
});

export interface ZeroLightProviderProps {
  tokens?: ZeroLightTokens;
  updateTokens?: (updates: Partial<ZeroLightTokens>) => void;
  children: React.ReactNode;
}

export function ZeroLightProvider({
  tokens = DEFAULT_TOKENS,
  updateTokens,
  children,
}: ZeroLightProviderProps) {
  const scaled = useMemo(() => computeScaledTokens(tokens), [tokens]);

  // Dynamically load active Google Font families on demand without page reload
  useEffect(() => {
    if (typeof document === "undefined" || !scaled.googleFontsUrl) return;
    const linkId = "zerolight-google-fonts";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== scaled.googleFontsUrl) {
      link.href = scaled.googleFontsUrl;
    }
  }, [scaled.googleFontsUrl]);

  const value = useMemo(
    () => ({
      tokens,
      scaled,
      updateTokens,
    }),
    [tokens, scaled, updateTokens]
  );

  return (
    <ZeroLightContext.Provider value={value}>
      <div
        dir={scaled.direction}
        data-zl-polarity={scaled.isDarkSurface ? "dark" : "light"}
        data-zl-typography-scope="true"
        style={
          {
            "--zl-text": tokens.textIconColor,
            "--zl-surface": tokens.universalFillColor,
            "--zl-border": tokens.universalBorderColor,
            "--zl-hover": tokens.hoverBackplateTint,
            "--zl-font-family": scaled.resolvedFontFamily,
            "--zl-heading-font": scaled.resolvedHeadingFontFamily,
            "--zl-body-weight": String(scaled.bodyWeight),
            "--zl-heading-weight": String(scaled.headingWeight),
            "--zl-font-style": scaled.fontStyle,
            "--zl-letter-spacing": scaled.letterSpacingCss,
            "--zl-line-height": scaled.lineHeightCss,
            "--zl-font-variant-numeric": scaled.fontVariantNumeric,
          } as React.CSSProperties
        }
        className="contents"
      >
        {children}
      </div>
    </ZeroLightContext.Provider>
  );
}

export function useZeroLight(): ZeroLightContextValue {
  return useContext(ZeroLightContext);
}
