import React, { useState } from "react";
import { sampleParticipants, theme } from "./theme";
import "./App.css";
import { assignGroups, GroupConfigType } from "./groupSplitter";
import { SubgroupVisualization } from "./SubGroupVisualization";
import { NameTagList } from "./NameTagList";
import { GroupConfig } from "./GroupConfig";
import { ParticipantInput } from "./ParticipantInput";
import { AvoidPairsConfig } from "./AvoidPairsConfig";

const defaultConfig = { numbers: 4, letters: 4, colors: 4, shapes: 2 };

const App: React.FC = () => {
  const [avoidPairs, setAvoidPairs] = useState<string[][]>([]);
  const [participants, setParticipants] = useState("");
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [config, setConfig] = useState<GroupConfigType>(defaultConfig);

  const names = participants
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);
  const tags = assignGroups(names, config, avoidPairs);

  const controls = (
    <>
      <h1>Group Splitter</h1>
      <div style={{ marginBottom: theme.sizes.spacing * 2 }}>
        <button
          onClick={() => setParticipants(sampleParticipants)}
          style={{ marginRight: theme.sizes.spacing }}
        >
          Load Sample Data
        </button>
        <button onClick={() => setParticipants("")}>Reset</button>
      </div>
      <ParticipantInput value={participants} onChange={setParticipants} />
      <AvoidPairsConfig
        names={names}
        pairs={avoidPairs}
        onChange={(newPairs) => setAvoidPairs(newPairs)}
      />
      <GroupConfig config={config} setConfig={setConfig} />
      <SubgroupVisualization tags={tags} config={config} />
    </>
  );

  return (
    <div
      style={{
        padding: theme.sizes.spacing * 4,
        display: "flex",
        flexDirection: "column",
        gap: theme.sizes.spacing * 4,
      }}
    >
      {!isPrintMode && controls}
      <NameTagList
        tags={tags}
        isPrintMode={isPrintMode}
        onPrintModeChange={(newValue) => setIsPrintMode(newValue)}
      />
    </div>
  );
};

export default App;
