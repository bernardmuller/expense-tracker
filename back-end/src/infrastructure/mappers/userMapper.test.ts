import { type User as DomainUser } from "@/domain/entities/user";
import { type User as DbUser } from "@/infrastructure/db/schema";
import { generateUuid } from "@/lib/utils/generateUuid";
import { beforeEach, describe, expect, it } from "vitest";
import { mapToDomainUser } from "./userMapper";

describe("mapToDomainUser", () => {
  it("should map a Db user to a Domain User Type", () => {
    const mockDbUser: DbUser = {
      id: generateUuid(),
      email: "john@doe.com",
      name: "John",
      createdAt: new Date(),
      updatedAt: new Date(),
      image: "",
      emailVerified: true,
      onboarded: true,
    };
    const result = mapToDomainUser(mockDbUser);
    expect(result).toBeTruthy();
    if (result) {
      const domainUser = result;
      expect(domainUser).toEqual({
        id: mockDbUser.id,
        email: mockDbUser.email,
        name: mockDbUser.name,
        emailVerified: mockDbUser.emailVerified,
        onboarded: mockDbUser.onboarded,
      });
    }
  });
});
