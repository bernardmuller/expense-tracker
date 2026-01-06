import { strapi } from "@strapi/client";
import type { HeroSectionDocument, DocumentResponse } from "@/types/cms";

const strapiClient = strapi({
  baseURL: "http://localhost:1337/api",
  auth: "5b6276b2481e0579d2cfe5350d63eaf63f75b5031af9f1c6407f77a9611cbd40566654fc07bd5271cbd6975725fdc7e425305a1439104a195c60a882dd1b8903ce90dbb9f9449f3e09c74d2f2af90d5ae1caeb6838be52ef0fa002077195834d01aca19b59e37884f87c0bce18b330b46881ea64e4295b0b85c0d9d09fb6b757",
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

// Export the base client for other uses
export { strapiClient as client };
