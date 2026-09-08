import crypto from "node:crypto";
import bcrypt from "bcrypt";
import env from "@/env";
import {
  fromPromise,
  fromThrowable,
  ok,
  okAsync,
  errAsync,
  Result,
  ResultAsync,
} from "neverthrow";
import { EncryptionError } from "@/lib/errors/domain";

const ENCRYPTION_KEY = env.ENCRYPTION_KEY;
const ALGO = "aes-256-gcm";

const bcryptGenSalt = (rounds: number) =>
  fromPromise(
    bcrypt.genSalt(rounds),
    () => new EncryptionError("Failed to generate salt"),
  );

const bcryptHash = (string: string, salt: string) =>
  fromPromise(
    bcrypt.hash(string, salt),
    () => new EncryptionError("Failed to hash string"),
  );

const bcryptCompare = (string: string, hash: string) =>
  fromPromise(
    bcrypt.compare(string, hash),
    () => new EncryptionError("Failed to compare hash"),
  );

export const encrypt = (
  value: string,
): ResultAsync<
  { ciphertext: string; iv: string; tag: string },
  EncryptionError
> => {
  const iv = crypto.randomBytes(12);

  const result = createCipherivSafe(
    ALGO,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv,
  ).andThen((cipher) => {
    return cipherUpdateSafe(cipher, value, "utf8", "base64url").andThen(
      (encrypted) => {
        return cipherFinalSafe(cipher, "base64url").andThen((finalPart) => {
          const authTagResult = fromThrowable(
            () => cipher.getAuthTag(),
            () => new EncryptionError("Failed to get auth tag"),
          )();

          return authTagResult.map((authTag) => ({
            ciphertext: encrypted + finalPart,
            iv: iv.toString("base64url"),
            tag: authTag.toString("base64url"),
          }));
        });
      },
    );
  });

  return result.match(
    (value) => okAsync(value),
    (error) => errAsync(error),
  );
};

export const decrypt = (
  ciphertext: string,
  iv: string,
  tag: string,
): ResultAsync<string, EncryptionError> => {
  const result = createDecipherivSafe(
    ALGO,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.from(iv, "base64url"),
  ).andThen((decipher) => {
    const setAuthTagResult = fromThrowable(
      () => decipher.setAuthTag(Buffer.from(tag, "base64url")),
      () => new EncryptionError("Failed to set auth tag"),
    )();

    return setAuthTagResult.andThen(() =>
      decipherUpdateSafe(
        decipher,
        ciphertext,
        "base64url",
        "utf8",
      ).andThen((decrypted) => {
        return decipherFinalSafe(decipher, "utf8").map((finalPart) => {
          return decrypted + finalPart;
        });
      }),
    );
  });

  return result.match(
    (value) => okAsync(value),
    (error) => errAsync(error),
  );
};

const createCipherivSafe = fromThrowable(
  (algo: string, key: Buffer, iv: Buffer) =>
    crypto.createCipheriv(algo, key, iv) as crypto.CipherGCM,
  () => new EncryptionError("Failed to create cipher"),
);

const createDecipherivSafe = fromThrowable(
  (algo: string, key: Buffer, iv: Buffer) =>
    crypto.createDecipheriv(algo, key, iv) as crypto.DecipherGCM,
  () => new EncryptionError("Failed to create decipher"),
);

const cipherUpdateSafe = fromThrowable(
  (
    cipher: crypto.CipherGCM,
    data: string,
    inputEncoding: crypto.Encoding,
    outputEncoding: crypto.Encoding,
  ) => cipher.update(data, inputEncoding, outputEncoding),
  () => new EncryptionError("Failed to update cipher"),
);

const cipherFinalSafe = fromThrowable(
  (cipher: crypto.CipherGCM, outputEncoding: crypto.Encoding) =>
    cipher.final(outputEncoding),
  () => new EncryptionError("Failed to finalize cipher"),
);

const decipherUpdateSafe = fromThrowable(
  (
    decipher: crypto.DecipherGCM,
    data: string,
    inputEncoding: crypto.Encoding,
    outputEncoding: crypto.Encoding,
  ) => decipher.update(data, inputEncoding, outputEncoding),
  () => new EncryptionError("Failed to update decipher"),
);

const decipherFinalSafe = fromThrowable(
  (decipher: crypto.DecipherGCM, outputEncoding: crypto.Encoding) =>
    decipher.final(outputEncoding),
  () => new EncryptionError("Failed to finalize decipher"),
);

// All encryption errors now use the unified EncryptionError class from lib/errors/domain
// This provides consistent error handling across the application

export const isEncrypted = (
  currentAmount: string,
  iv: string | null,
  tag: string | null,
): boolean => {
  if (!iv || !tag) {
    return false;
  }

  if (/^\d+(\.\d+)?([eE][+-]?\d+)?$/.test(currentAmount)) {
    return false;
  }

  return true;
};
