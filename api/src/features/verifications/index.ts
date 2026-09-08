import { createRouter } from "@/lib/http/createApi";
import { getVerificationsRoute } from "./http/getVerifications.route";
import { getVerificationsHandler } from "./http/getVerifications.handler";
import { getVerificationByIdRoute } from "./http/getVerificationById.route";
import { getVerificationByIdHandler } from "./http/getVerificationById.handler";
import { createVerificationRoute } from "./http/createVerification.route";
import { createVerificationHandler } from "./http/createVerification.handler";
import { updateVerificationRoute } from "./http/updateVerification.route";
import { updateVerificationHandler } from "./http/updateVerification.handler";
import { deleteVerificationRoute } from "./http/deleteVerification.route";
import { deleteVerificationHandler } from "./http/deleteVerification.handler";

export const verificationRouter = createRouter()
  .openapi(getVerificationsRoute, getVerificationsHandler)
  .openapi(getVerificationByIdRoute, getVerificationByIdHandler)
  .openapi(createVerificationRoute, createVerificationHandler)
  .openapi(updateVerificationRoute, updateVerificationHandler)
  .openapi(deleteVerificationRoute, deleteVerificationHandler);
