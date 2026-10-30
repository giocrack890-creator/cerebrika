import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "16px",
          background: "#1C1714",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#F3EEE6",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.06em",
          }}
        >
          C
        </div>
      </div>
    ),
    { ...size },
  );
}
