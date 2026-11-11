"use client";

import React, { createContext, useContext, useMemo } from "react";
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
        style={
          {
            "--zl-text": tokens.textIconColor,
            "--zl-surface": tokens.universalFillColor,
            "--zl-border": tokens.universalBorderColor,
            "--zl-hover": tokens.hoverBackplateTint,
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
