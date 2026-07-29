import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FECON · Trabajá con nosotros";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Preview del link de la convocatoria (WhatsApp, Instagram, etc.).
export default function TrabajaOpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", position: "relative", width: 76, height: 95 }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 19,
                height: 95,
                background: "#FAF6EE",
                borderRadius: 3,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 27,
                top: 0,
                width: 49,
                height: 23,
                background: "#8A6E3C",
                borderRadius: 3,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 27,
                top: 35,
                width: 35,
                height: 23,
                background: "#FAF6EE",
                borderRadius: 3,
              }}
            />
          </div>
          <div style={{ fontSize: 82, fontWeight: 800, letterSpacing: -4 }}>
            FECON
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#A2823F",
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            Convocatoria
          </div>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -4 }}>
            Sumate al equipo
          </div>
          <div style={{ fontSize: 32, color: "#9C958B" }}>
            Dejá tus datos y tu oficio · Trabajadores de toda la región
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
