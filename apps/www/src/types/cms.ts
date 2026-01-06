import type { API } from "@strapi/client";

export interface Badge {
  id: number;
  label: string;
  variant: "default" | "outline";
}

export interface CallToAction {
  id: number;
  label: string;
  variant: "default" | "secondary" | "link";
  link: string;
}

export interface HeroSectionDocument extends API.Document {
  highlights: Badge[];
  caption: string;
  name: string;
  description: string;
  actions: CallToAction[];
}

export type DocumentResponse<T extends API.Document = API.Document> =
  API.DocumentResponse<T>;
