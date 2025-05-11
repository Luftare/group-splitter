import { colorKeys, letters, theme } from "./theme";
import { GroupConfigType } from "./groupSplitter";

export const GroupConfig = ({
  config,
  setConfig,
}: {
  config: GroupConfigType;
  setConfig: (c: GroupConfigType) => void;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: theme.sizes.spacing * 2,
    }}
  >
    <h2>Group sizes</h2>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: theme.sizes.spacing * 2,
      }}
    >
      <label>
        Numbers:
        <input
          type="number"
          min={2}
          max={10}
          value={config.numbers}
          onChange={(e) => setConfig({ ...config, numbers: +e.target.value })}
        />
      </label>
      <label>
        Colors:
        <input
          type="number"
          min={2}
          max={colorKeys.length}
          value={config.colors}
          onChange={(e) => setConfig({ ...config, colors: +e.target.value })}
        />
      </label>
      <label>
        Shapes:
        <input
          type="number"
          min={2}
          max={theme.shapes.length}
          value={config.shapes}
          onChange={(e) => setConfig({ ...config, shapes: +e.target.value })}
        />
      </label>
      <label>
        Letters:
        <input
          type="number"
          min={2}
          max={letters.length}
          value={config.letters}
          onChange={(e) => setConfig({ ...config, letters: +e.target.value })}
        />
      </label>
    </div>
  </div>
);
