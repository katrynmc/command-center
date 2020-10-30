import React, { FC, useState, useEffect } from "react";
import { Static, Text, Box, Newline, useInput, useApp, useStdout } from "ink";
import SelectInput from "ink-select-input";
import Link from "ink-link";

const exec = require("child_process").exec;

// const { spawn } = require('child_process');

type Script = { name: string; command: string };
type AppOption = {
  name: "Settings-Engine" | "DAM" | "Habanero";
  scripts: Array<Script>;
  link: string;
};

const PROJECTS: Array<AppOption> = [
  {
    name: "Settings-Engine",
    scripts: [
      { name: "Run Settings Alone", command: "Foo" },
      { name: "Run with Dandelion", command: "Bar" },
    ],
    link: "https://github.com/salsify/settings-engine",
  },
  {
    name: "DAM",
    scripts: [
      { name: "Run DAM Alone", command: "Foo" },
      { name: "Run with Dandelion", command: "Bar" },
    ],
    link: "https://github.com/salsify/digital-asset-management-engine",
  },
  {
    name: "Habanero",
    scripts: [{ name: "Start Storybook", command: "Foo" }],
    link: "https://github.com/salsify/ui-habanero",
  },
];

const App: FC<{ name?: string }> = ({ name = "Stranger" }) => {
  const { exit } = useApp();
  const [microApp, setMicroApp] = useState<AppOption | null>(null);
  const [scriptToRun, setScript] = useState<Script | null>(null);
  const [selectedPane, setSelectedPane] = useState<"PROJECT" | "PROCESS">(
    "PROJECT"
  );
  const [logs, setLogs] = useState([]);

  const handleSelectProject = (item) => {
    const newMicroApp = PROJECTS.find((project) => project.name === item.label);
    setMicroApp(newMicroApp);
    setSelectedPane("PROCESS");
  };

  const handleRunScript = (item) => {
    const newScript = microApp.scripts.find(
      (project) => project.name === item.label
    );
    // spawn('./test.sh', [])
    setScript(newScript);
  };

  const { write } = useStdout();

  useEffect(() => {
    if (scriptToRun) {
      // Write a single message to stdout, above Ink's output
      const myShellScript = exec("sh ./test.sh");
      myShellScript.stdout.on("data", (data) => {
        console.log("hello");
        console.log(data);

        setLogs((previousLogs) => [
          ...previousLogs,
          {
            id: previousLogs.length,
            content: data,
          },
        ]);
        // do whatever you want here with data
      });
      myShellScript.stderr.on("data", (data) => {
        console.error(data);
      });

      setScript(null);
    }
  });

  useInput((input, key) => {
    if (input === "q") {
      exit();
    }
  });

  const applications = PROJECTS.map((app) => {
    return { label: app.name, value: app.name };
  });

  let secondPane;
  if (microApp) {
    const currentScripts = microApp.scripts.map((script) => {
      return { label: script.name, value: script.name };
    });

    let myScript;
    if (scriptToRun) {
      myScript = <Text>{scriptToRun.name}</Text>;
    }

    secondPane = (
      <Box borderStyle="single" flexDirection="column">
        <Text>{microApp.name}</Text>

        {/* <Link url="https://sindresorhus.com">
          My <Text color="cyan">Repo</Text>
        </Link> */}

        <SelectInput
          isFocused={selectedPane === "PROCESS"}
          items={currentScripts}
          onSelect={handleRunScript}
        />

        {myScript}
      </Box>
    );
  }

  return (
    <Box flexDirection="row">
      <Box borderStyle="single" flexDirection="column" alignItems="flex-start">
        <Text>Select a project to begin:</Text>

        <SelectInput
          isFocused={selectedPane === "PROJECT"}
          items={applications}
          onSelect={handleSelectProject}
        />
      </Box>
      {secondPane}

      <Static items={logs}>
        {(log) => (
          <Box key={log.id}>
            <Text color="green">✔ {log.content}</Text>
          </Box>
        )}
      </Static>
    </Box>
  );
};

module.exports = App;
export default App;
