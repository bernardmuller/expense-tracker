import { createRouter } from "@/lib/http/createApi";
import { getCategoriesRoute } from "./http/getCategories.route";
import { getCategoriesHandler } from "./http/getCategories.handler";
import { getCategoryExpenseTimeseriesRoute } from "./http/getCategoryExpenseTimeseries.route";
import { getCategoryExpenseTimeseriesHandler } from "./http/getCategoryExpenseTimeseries.handler";

export const categoryRouter = createRouter()
  .openapi(getCategoriesRoute, getCategoriesHandler)
  .openapi(
    getCategoryExpenseTimeseriesRoute,
    getCategoryExpenseTimeseriesHandler,
  );
