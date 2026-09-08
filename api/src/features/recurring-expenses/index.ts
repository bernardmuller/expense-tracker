import { createRouter } from "@/lib/http/createApi";
import { listTemplatesRoute } from "./http/listTemplates.route";
import { listTemplatesHandler } from "./http/listTemplates.handler";
import { createTemplateRoute } from "./http/createTemplate.route";
import { createTemplateHandler } from "./http/createTemplate.handler";
import { updateTemplateRoute } from "./http/updateTemplate.route";
import { updateTemplateHandler } from "./http/updateTemplate.handler";
import { deleteTemplateRoute } from "./http/deleteTemplate.route";
import { deleteTemplateHandler } from "./http/deleteTemplate.handler";
import { listBudgetInstancesRoute } from "./http/listBudgetInstances.route";
import { listBudgetInstancesHandler } from "./http/listBudgetInstances.handler";
import { updateInstanceStatusRoute } from "./http/updateInstanceStatus.route";
import { updateInstanceStatusHandler } from "./http/updateInstanceStatus.handler";
import { deleteInstanceRoute } from "./http/deleteInstance.route";
import { deleteInstanceHandler } from "./http/deleteInstance.handler";

export const recurringExpensesRouter = createRouter()
  .openapi(listTemplatesRoute, listTemplatesHandler)
  .openapi(createTemplateRoute, createTemplateHandler)
  .openapi(updateTemplateRoute, updateTemplateHandler)
  .openapi(deleteTemplateRoute, deleteTemplateHandler)
  .openapi(listBudgetInstancesRoute, listBudgetInstancesHandler)
  .openapi(updateInstanceStatusRoute, updateInstanceStatusHandler)
  .openapi(deleteInstanceRoute, deleteInstanceHandler);
