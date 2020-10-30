interface Script {
  name: string;
  command: string
}

interface AppOption {
  name: string;
  scripts: Array<Script>;
}

type Projects = Array<AppOption>;

export default Projects;
