import React, { FC, useState, useEffect } from "react";
import { Static, Text, Box, useInput, useApp } from "ink";
import SelectInput from "ink-select-input";

import PROJECTS, {Project, Script} from "../project-config.js";

import { exec } from "child_process";

type ListOption = { label: string; value: string };
type Log = { id: number; content: string };

const App: FC<{ name?: string }> = () => {
  const { exit } = useApp();

  const [project, setProject] = useState<Project | null>(null);
  const [scriptToRun, setScript] = useState<Script | null>(null);
  const [selectedPane, setSelectedPane] = useState<"PROJECT" | "PROCESS">(
    "PROJECT"
  );

  const LOG_DEFAULT: Array<Log> = [];
  const [logs, setLogs] = useState<Array<Log>>(LOG_DEFAULT);

  const handleSelectProject = (item: ListOption) => {
    const newProject = PROJECTS.find((project) => project.name === item.label);
    if (newProject) {
      setProject(newProject);
      setSelectedPane("PROCESS");
    }
  };

  const handleRunScript = (item: ListOption) => {
    if (project) {
      const newScript = project.scripts.find(
        (script) => script.name === item.label
      );

      if (newScript) {
        setScript(newScript);
      }
    }
  };

  useEffect(() => {
    if (scriptToRun) {
      const myShellScript = exec(`sh ./start.sh -p "${project?.path}" -s "${scriptToRun.command}"`);

      if (myShellScript.stdout) {
        myShellScript.stdout.on("data", (data: string) => {
          console.log(data);

          setLogs((previousLogs) => [
            ...previousLogs,
            {
              id: previousLogs.length,
              content: data,
            },
          ]);
        });
      }

      if (myShellScript.stderr) {
        myShellScript.stderr.on("data", (data: string) => {
          console.error(data);
        });
      }

      setScript(null);
    }
  });

  useInput((input) => {
    if (input === "q") {
      exit();
    }
  });

  const applications = PROJECTS.map((app) => {
    return { label: app.name, value: app.name };
  });

  let secondPane;
  if (project) {
    const currentScripts = project.scripts.map((script) => {
      return { label: script.name, value: script.name };
    });

    let myScript;
    if (scriptToRun) {
      myScript = <Text>{scriptToRun.name}</Text>;
    }

    secondPane = (
      <Box borderStyle="single" flexDirection="column">
        <Text>{project.name}</Text>

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
