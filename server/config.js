import "dotenv/config";

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    // value값이 null이거나 undefined라면
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  host: {
    port: parseInt(required("HOST_PORT", 8080)),
  },
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)),
  },
};
