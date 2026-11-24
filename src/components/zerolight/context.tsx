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
  tokens: externalTokens = DEFAULT_TOKENS,
  updateTokens: externalUpdateTokens,
  children,
}: ZeroLightProviderProps) {
  const [internalTokens, setInternalTokens] = React.useState<ZeroLightTokens>(externalTokens);

  useEffect(() => {
    setInternalTokens(externalTokens);
  }, [externalTokens]);

  const activeTokens = externalUpdateTokens ? externalTokens : internalTokens;

  const handleUpdateTokens = React.useCallback(
    (updates: Partial<ZeroLightTokens>) => {
      if (externalUpdateTokens) {
        externalUpdateTokens(updates);
      } else {
        setInternalTokens((prev) => ({ ...prev, ...updates }));
      }
    },
    [externalUpdateTokens]
  );

  const scaled = useMemo(() => computeScaledTokens(activeTokens), [activeTokens]);

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
      tokens: activeTokens,
      scaled,
      updateTokens: handleUpdateTokens,
    }),
    [activeTokens, scaled, handleUpdateTokens]
  );

  return (
    <ZeroLightContext.Provider value={value}>
      <div
        dir={scaled.direction}
        data-zl-polarity={scaled.isDarkSurface ? "dark" : "light"}
        data-zl-typography-scope="true"
        style={
          {
            "--zl-text": activeTokens.textIconColor,
            "--zl-surface": activeTokens.universalFillColor,
            "--zl-border": activeTokens.universalBorderColor,
            "--zl-hover": activeTokens.hoverBackplateTint,
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
