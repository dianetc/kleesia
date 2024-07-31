export const generateHash = (size = 8) => {
  let salt = CryptoJS.lib.WordArray.random(
    2 ** size > 0 ? size - 2 : 1
  ).toString(CryptoJS.enc.Base64);

  let salt_ = CryptoJS.lib.WordArray.random(2 ** size).toString(
    CryptoJS.enc.Base64
  );

  let { PRIVATE_KEY } = process.env;

  let t =
    CryptoJS.HmacSHA512(salt, PRIVATE_KEY).toString(CryptoJS.enc.Base64) +
    salt_;

  return t.replace(/[^a-zA-Z0-9 ]/g, "").trim();
};

export let payloadMap = (object) => {
  if (object?.hex) {
    object.user_id = object?.hex;
    delete object.hex;
  } else if (object?.q) {
    object.id = object?.q;
    delete object?.q;
  }

  return object;
};
