import { createDefine } from "fresh";
import { AppState } from "@/types/state.type.ts";

export type State = AppState;

export const define = createDefine<State>();
