import { strapi } from "@strapi/client";
import type { HeroSectionDocument, DocumentResponse } from "@/types/cms";

const strapiClient = strapi({
  baseURL: import.meta.env.PUBLIC_STRAPI_URL,
  auth: import.meta.env.PUBLIC_STRAPI_API_TOKEN,
});

export const cmsClient = {
  heroSection: {
    async find(options?: {
      populate?: string[];
    }): Promise<DocumentResponse<HeroSectionDocument>> {
      return strapiClient.single("hero-section").find(options) as Promise<
        DocumentResponse<HeroSectionDocument>
      >;
    },
  },
};

export { strapiClient as client };
