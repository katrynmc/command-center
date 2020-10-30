export interface Script {
  name: string;
  command: string
};

export interface AppOption {
  name: string;
  scripts: Array<Script>;
};

declare const Projects: Array<AppOption>;

export default Projects;
