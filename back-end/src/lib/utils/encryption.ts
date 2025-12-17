import crypto from "node:crypto";
import bcrypt from "bcrypt";
import env from "@/env";
import {
  fromPromise,
  fromThrowable,
  ok,
  Result,
  ResultAsync,
} from "neverthrow";
import { createError } from "../utils/createError";

const ENCRYPTION_KEY = env.ENCRYPTION_KEY;
const ALGO = "aes-256-gcm";

const bcryptGenSalt = (rounds: number) =>
  fromPromise(
    bcrypt.genSalt(rounds),
    () => new EncryptionSaltGenerationError(),
  );

const bcryptHash = (string: string, salt: string) =>
  fromPromise(bcrypt.hash(string, salt), () => new EncryptionHashError());

const bcryptCompare = (string: string, hash: string) =>
  fromPromise(
    bcrypt.compare(string, hash),
    () => new EncryptionComparisonError(),
  );

const encrypt = async (value: string) => {
  const iv = crypto.randomBytes(12);

  return createCipherivSafe(
    ALGO,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv,
  ).andThen((cipher) => {
    return cipherUpdateSafe(cipher, value, "utf8", "base64url").andThen(
      (encrypted) => {
        return cipherFinalSafe(cipher, "base64url").map((finalPart) => {
          return {
            ciphertext: encrypted + finalPart,
            iv: iv.toString("base64url"),
          };
        });
      },
    );
  });
};

const decrypt = async (ciphertext: string, iv: string, tag: string) => {
  return createDecipherivSafe(
    ALGO,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.from(iv, "base64url"),
  ).andThen((decipher) => {
    return decipherUpdateSafe(
      decipher,
      ciphertext,
      "base64url",
      "utf8",
    ).andThen((decrypted) => {
      return decipherFinalSafe(decipher, "utf8").map((finalPart) => {
        return decrypted + finalPart;
      });
    });
  });
};

const createCipherivSafe = fromThrowable(
  (algo: string, key: Buffer, iv: Buffer) =>
    crypto.createCipheriv(algo, key, iv),
  () => new EncryptionCipherCreationError(),
);

const createDecipherivSafe = fromThrowable(
  (algo: string, key: Buffer, iv: Buffer) =>
    crypto.createDecipheriv(algo, key, iv),
  () => new EncryptionDecipherCreationError(),
);

const cipherUpdateSafe = fromThrowable(
  (
    cipher: crypto.Cipher,
    data: string,
    inputEncoding: crypto.Encoding,
    outputEncoding: crypto.Encoding,
  ) => cipher.update(data, inputEncoding, outputEncoding),
  () => new EncryptionCipherUpdateError(),
);

const cipherFinalSafe = fromThrowable(
  (cipher: crypto.Cipher, outputEncoding: crypto.Encoding) =>
    cipher.final(outputEncoding),
  () => new EncryptionCipherFinalError(),
);

const decipherUpdateSafe = fromThrowable(
  (
    decipher: crypto.Decipher,
    data: string,
    inputEncoding: crypto.Encoding,
    outputEncoding: crypto.Encoding,
  ) => decipher.update(data, inputEncoding, outputEncoding),
  () => new EncryptionDecipherUpdateError(),
);

const decipherFinalSafe = fromThrowable(
  (decipher: crypto.Decipher, outputEncoding: crypto.Encoding) =>
    decipher.final(outputEncoding),
  () => new EncryptionDecipherFinalError(),
);

export const EncryptionSaltGenerationError = createError(
  "EncryptionSaltGenerationError",
  () => "Encryption salt generation error",
  {
    code: "ENCRYPTION_SALT_GENERATION_ERROR",
    error: "Failed to generate salt",
    statusCode: 500,
  },
);

export const EncryptionHashError = createError(
  "EncryptionHashError",
  () => "Encryption hash error",
  {
    code: "ENCRYPTION_HASH_ERROR",
    error: "Failed to hash string",
    statusCode: 500,
  },
);

export const EncryptionComparisonError = createError(
  "EncryptionComparisonError",
  () => "Encryption comparison error",
  {
    code: "ENCRYPTION_COMPARISON_ERROR",
    error: "Failed to compare hash",
    statusCode: 500,
  },
);

export const EncryptionCipherCreationError = createError(
  "EncryptionCipherCreationError",
  () => "Encryption cipher creation error",
  {
    code: "ENCRYPTION_CIPHER_CREATION_ERROR",
    error: "Failed to create cipher",
    statusCode: 500,
  },
);

export const EncryptionCipherUpdateError = createError(
  "EncryptionCipherUpdateError",
  () => "Encryption cipher update error",
  {
    code: "ENCRYPTION_CIPHER_UPDATE_ERROR",
    error: "Failed to update cipher",
    statusCode: 500,
  },
);

export const EncryptionCipherFinalError = createError(
  "EncryptionCipherFinalError",
  () => "Encryption cipher finalization error",
  {
    code: "ENCRYPTION_CIPHER_FINAL_ERROR",
    error: "Failed to finalize cipher",
    statusCode: 500,
  },
);

export const EncryptionDecipherCreationError = createError(
  "EncryptionDecipherCreationError",
  () => "Encryption decipher creation error",
  {
    code: "ENCRYPTION_DECIPHER_CREATION_ERROR",
    error: "Failed to create decipher",
    statusCode: 500,
  },
);

export const EncryptionDecipherUpdateError = createError(
  "EncryptionDecipherUpdateError",
  () => "Encryption decipher update error",
  {
    code: "ENCRYPTION_DECIPHER_UPDATE_ERROR",
    error: "Failed to update decipher",
    statusCode: 500,
  },
);

export const EncryptionDecipherFinalError = createError(
  "EncryptionDecipherFinalError",
  () => "Encryption decipher finalization error",
  {
    code: "ENCRYPTION_DECIPHER_FINAL_ERROR",
    error: "Failed to finalize decipher",
    statusCode: 500,
  },
);
