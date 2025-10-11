import { Layer } from "effect";
import { TransactionLayerLive } from "@/application/layers/transactionLayer";
import { UserLayerLive } from "@/application/layers/userLayer";

/**
 * AppLayer combines all application layers into a single layer
 * that can be provided to the Effect runtime.
 */
export const AppLayer = Layer.mergeAll(TransactionLayerLive, UserLayerLive);
