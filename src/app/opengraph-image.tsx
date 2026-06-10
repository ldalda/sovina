import { ImageResponse } from "next/og";

// Card de compartilhamento (OG image) — brutalismo do Sovina em 1200x630.
// Gerado em runtime pelo next/og; linkado automaticamente pela convenção.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "O Sovina — você não gere seu dinheiro. Você presta contas a ele.";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0D0D",
          padding: 64,
          borderTop: "14px solid #FFB300",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#FFB300",
            letterSpacing: 10,
            textTransform: "uppercase",
          }}
        >
          O Sovina
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 86,
            fontWeight: 800,
            color: "#F5F5F5",
            lineHeight: 1.04,
            textTransform: "uppercase",
          }}
        >
          <span>Você não gere</span>
          <span>seu dinheiro.</span>
          <span style={{ color: "#FFB300" }}>Você presta contas a ele.</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 28,
            color: "#8C8C8C",
          }}
        >
          <span>Gestor financeiro autoritário</span>
          <span style={{ color: "#E53935" }}>
            Entre na fila do julgamento
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
