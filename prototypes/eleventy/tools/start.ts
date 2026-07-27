import concurrently from "concurrently";
import path from "node:path";
import { info, log } from '#tool/log';

info("Starting backend and frontend");

const { result } = await concurrently([
  {
    name: "backend",
    command: "echo 'Backend not implemented yet' && true",
    cwd: path.resolve(import.meta.dirname)
  },
  {
    name: "frontend",
    command: "nub run start",
    cwd: path.resolve(import.meta.dirname, 'src/frontend')
  }
]);

log(result);
