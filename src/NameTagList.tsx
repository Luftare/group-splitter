/// <reference types="vite-plugin-svgr/client" />
import { useState } from "react";
import { NameTagType } from "./groupSplitter";
import { theme } from "./theme";

import CircleShape from "./assets/shape-circle.svg?react";
import DiamondShape from "./assets/shape-diamond.svg?react";
import SquareShape from "./assets/shape-square.svg?react";
import StarShape from "./assets/shape-start.svg?react";
import TriangleShape from "./assets/shape-triangle.svg?react";

export const NameTagList = ({
  tags,
  isPrintMode,
  onPrintModeChange,
}: {
  tags: NameTagType[];
  isPrintMode: boolean;
  onPrintModeChange: (newValue: boolean) => void;
}) => {
  const [fontSize, setFontSize] = useState(24);
  const [widthCm, setWidthCm] = useState(8);
  const [heightCm, setHeightCm] = useState(4);

  const size = `${fontSize * 1}px`;

  const renderShape = (shapeName: string, color: string) => {
    switch (shapeName) {
      case "circle":
        return <CircleShape fill={color} width={size} height={size} />;
      case "diamond":
        return <DiamondShape fill={color} width={size} height={size} />;
      case "square":
        return <SquareShape fill={color} width={size} height={size} />;
      case "star":
        return <StarShape fill={color} width={size} height={size} />;
      case "triangle":
        return <TriangleShape fill={color} width={size} height={size} />;
      default:
        return <CircleShape fill={color} width={size} height={size} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.sizes.spacing * 2,
      }}
    >
      <div style={{ display: "flex", gap: theme.sizes.spacing * 4 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.sizes.spacing,
          }}
        >
          <label>Width:</label>
          <input
            type="number"
            style={{ width: theme.sizes.spacing * 8 }}
            value={widthCm}
            onChange={(e) => setWidthCm(parseFloat(e.target.value))}
          />
          <label>cm</label>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.sizes.spacing,
          }}
        >
          <label>Height:</label>
          <input
            type="number"
            style={{ width: theme.sizes.spacing * 8 }}
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value))}
          />
          <label>cm</label>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.sizes.spacing,
          }}
        >
          <label>Font:</label>
          <input
            type="number"
            style={{ width: theme.sizes.spacing * 8 }}
            value={fontSize}
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
          />
        </div>

        <button onClick={() => onPrintModeChange(!isPrintMode)}>
          {isPrintMode ? "Show all controls" : "Print labels"}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          // gap: theme.sizes.spacing
        }}
      >
        {tags.map((tag) => (
          <div
            key={tag.name}
            style={{
              position: "relative",
              border: "1px solid #eee",
              boxSizing: "border-box",
              width: `${widthCm}cm`,
              height: `${heightCm}cm`,
              background: theme.colors.shapeBg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: `${fontSize}px` }}>
              {tag.name}
            </div>
            <div
              style={{
                position: "absolute",
                lineHeight: 0.5,
                bottom: "8px",
                left: "8px",
                display: "flex",
                gap: "8px",
                fontSize: `${fontSize}px`,
                alignItems: "center",
                color: theme.colors[tag.color as keyof typeof theme.colors],
              }}
            >
              {renderShape(
                tag.shape,
                theme.colors[tag.color as keyof typeof theme.colors]
              )}
              <span>{tag.number} </span>
              <span>{tag.letter} </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
theme.colors;
