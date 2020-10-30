export interface Script {
  name: string;
  command: string
}

export interface Project {
  name: string;
  scripts: Array<Script>;
  /**
   * The path to your local version of the repo
   */
  path: string;
}

declare const Projects: Array<Project>;

export default Projects;
