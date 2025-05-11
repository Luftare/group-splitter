import React, { useState } from "react";
import { sampleParticipants, theme } from "./theme";
import "./App.css";
import { assignGroups, GroupConfigType } from "./groupSplitter";
import { SubgroupVisualization } from "./SubGroupVisualization";
import { NameTagList } from "./NameTagList";
import { GroupConfig } from "./GroupConfig";
import { ParticipantInput } from "./ParticipantInput";
import { AvoidPairsConfig } from "./AvoidPairsConfig";

const defaultConfig = { numbers: 4, letters: 4, colors: 3, shapes: 2 };

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

  const hasParticipants = names.length > 0;

  const participantContent = (
    <>
      <GroupConfig config={config} setConfig={setConfig} />
      <SubgroupVisualization tags={tags} config={config} />
      <AvoidPairsConfig
        names={names}
        pairs={avoidPairs}
        onChange={(newPairs) => setAvoidPairs(newPairs)}
      />
    </>
  );

  const controls = (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.sizes.spacing * 4,
        }}
      >
        <h1>Workshop Wizard</h1>
        <p>
          Facilitate workshops like a wizard. Effortlessly split participants in
          multiple subgroups with zero hassle.
        </p>
        <ParticipantInput value={participants} onChange={setParticipants} />
        <div>
          <button
            className="text-button"
            onClick={() => setParticipants(sampleParticipants)}
            style={{ marginRight: theme.sizes.spacing }}
          >
            Try with sample names
          </button>
          <button className="text-button" onClick={() => setParticipants("")}>
            Reset
          </button>
        </div>
      </div>
      {hasParticipants && participantContent}
    </>
  );

  return (
    <div
      style={{
        padding: theme.sizes.spacing * 4,
        display: "flex",
        flexDirection: "column",
        gap: theme.sizes.spacing * 16,
        width: "100%",
      }}
    >
      {!isPrintMode && controls}
      {hasParticipants && (
        <NameTagList
          tags={tags}
          isPrintMode={isPrintMode}
          onPrintModeChange={(newValue) => setIsPrintMode(newValue)}
        />
      )}
    </div>
  );
};

export default App;
