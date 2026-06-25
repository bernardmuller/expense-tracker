import "dotenv/config";
import { db } from "./index";
import { users, notificationPreferences } from "./schema";
import { and, eq } from "drizzle-orm";
import { generateUuid } from "@/lib/utils/generateUuid";
import { NOTIFICATION_TYPES } from "@/lib/constants";

export async function seedNotificationPreferences() {
  const allUsers = await db.select().from(users);
  console.log(`Found ${allUsers.length} users.`);

  let created = 0;
  let skipped = 0;

  for (const user of allUsers) {
    const existing = await db
      .select()
      .from(notificationPreferences)
      .where(
        and(
          eq(notificationPreferences.userId, user.id),
          eq(notificationPreferences.type, NOTIFICATION_TYPES.ACTIVITY_REMINDER),
        ),
      );

    if (existing.length > 0) {
      console.log(`Skipping user ${user.id} — preference already exists.`);
      skipped++;
      continue;
    }

    const now = new Date();
    await db.insert(notificationPreferences).values({
      id: generateUuid(),
      userId: user.id,
      type: NOTIFICATION_TYPES.ACTIVITY_REMINDER,
      enabled: false,
      channel: "telegram",
      createdAt: now,
      updatedAt: now,
    });
    created++;
  }

  console.table([
    { Entity: "Notification Preferences", Created: created, Skipped: skipped },
  ]);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  seedNotificationPreferences()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
