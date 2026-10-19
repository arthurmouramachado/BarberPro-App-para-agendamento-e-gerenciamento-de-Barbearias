import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";

const fonts = { Inter_400Regular, Inter_600SemiBold, Inter_700Bold };

async function loadFont(name: string, source: number) {
  if (Font.isLoaded(name)) return;

  try {
    await Font.loadAsync(name, source);
  } catch (error) {
    const asset = Asset.fromModule(source);
    const url = new URL(asset.uri);

    
    if (url.protocol !== "http:" || !url.hostname.endsWith(".exp.direct")) {
      throw error;
    }

    url.protocol = "https:";
    await Font.loadAsync(name, Asset.fromURI(url.href));
  }
}

export function useAppFonts() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    setError(null);
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      for (let round = 0; round < 3; round++) {
        if (cancelled) return;
        try {
          // Load sequentially to avoid competing font downloads on the tunnel.
          for (const [name, source] of Object.entries(fonts)) {
            if (cancelled) return;
            await loadFont(name, source);
          }
          if (!cancelled) setLoaded(true);
          return;
        } catch (cause) {
          if (cancelled) return;
          if (round === 2) {
            setError(cause instanceof Error ? cause : new Error(String(cause)));
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000 * (round + 1)));
        }
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [attempt]);

  return { loaded, error, retry };
}
