import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FECON · Constructora en Santa Fe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen para previews al compartir el link (WhatsApp, redes, etc.).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#211E1A",
          color: "#FAF6EE",
          padding: 90,
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        {/* Isotipo "Módulo" (F) + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", position: "relative", width: 120, height: 150 }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 30,
                height: 150,
                background: "#FAF6EE",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 42,
                top: 0,
                width: 78,
                height: 36,
                background: "#8A6E3C",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 42,
                top: 56,
                width: 56,
                height: 36,
                background: "#FAF6EE",
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ fontSize: 130, fontWeight: 800, letterSpacing: -6 }}>
            FECON
          </div>
        </div>

        {/* Bajada */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 52, fontWeight: 700 }}>
            Constructora en Santa Fe
          </div>
          <div style={{ fontSize: 32, color: "#A2823F" }}>
            Casas llave en mano · Remodelaciones · Techos de tejas
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
