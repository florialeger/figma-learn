export type TutorialProgress = "not_started" | "watched" | "finished";

export interface TutorialStepAsset {
  name: string;
  type: "copy" | "download";
  url: string;
}

export interface TutorialStep {
  stepId: number;
  title: string;
  description: string;
  tip?: string;
  videoUrl?: string;
  assets?: TutorialStepAsset[];
}

export interface TutorialMeta {
  time: string;
  level: string;
  thumbnailUrl: string;
  objective?: string;
  technique?: string[];
  typeDeSavoir?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: {
    short: string;
    long: string;
  };
  meta: TutorialMeta;
  steps: TutorialStep[];
}
