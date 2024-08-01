import CryptoJS from "crypto-js";

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
  let _temp = {};
  Object.entries(object).forEach(([key, value]) => {
    switch (key) {
      case "hex":
        _temp.user_id = value;
        break;
      case "q":
        _temp.id = value;
        break;
      case "ch":
        _temp.channel_id = value;
        break;
      case "contx":
        _temp.context_id = value;
        break;
      default:
        _temp[key] = value;
        break;
    }

    return _temp;
  });

  return _temp;
};
