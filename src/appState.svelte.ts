import { persistedState } from "./utils/idbPersistedState";
import { GlobalRune } from "./utils/globalRune.svelte";
import type { SponsorData } from "./parser";

export const sponsorsFileHandle = persistedState<FileSystemFileHandle>("sponsorsFileHandle");

export const sponsorsFileContent = new GlobalRune<string>();
export const sponsors = new GlobalRune<SponsorData[]>();
