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

export interface StrapiMedia {
  id: number;
  name: string;
  url: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
}

export interface HeroSectionDocument extends API.Document {
  highlights: Badge[];
  caption: string;
  name: string;
  description: string;
  actions: CallToAction[];
  github_link?: string;
  video?: StrapiMedia;
}

export type DocumentResponse<T extends API.Document = API.Document> =
  API.DocumentResponse<T>;
