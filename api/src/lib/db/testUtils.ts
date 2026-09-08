import { db } from "@/lib/db";
import { createTestContext, type AppContext } from "./context";

export const withTestTransaction = async <T>(
  testFn: (ctx: AppContext) => Promise<T>,
): Promise<void> => {
  try {
    await db.transaction(async (tx) => {
      const testCtx = createTestContext(tx);
      await testFn(testCtx);
      throw new Error("__TEST_ROLLBACK__");
    });
  } catch (error) {
    if (error instanceof Error && error.message !== "__TEST_ROLLBACK__") {
      throw error;
    }
  }
};

export const withRealTransaction = async <T>(
  testFn: (ctx: AppContext) => Promise<T>,
): Promise<T> => {
  return db.transaction(async (tx) => {
    const testCtx = createTestContext(tx);
    return await testFn(testCtx);
  });
};
