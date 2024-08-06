import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const allowed_emails = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[eE][dD][uU]$/;

export function isPayloadValid({ fields = [], payload }) {
  for (var i = 0; i < fields.length; i++) {
    let field = fields[i];
    if (payload[field]) {
      if (payload[field] !== "" || payload[field] !== null) {
        return true;
      } else {
        return `${field} is empty`;
      }
    } else {
      return `${field} is missing`;
    }
  }
}

export function capitalize(val) {
  return `${val?.slice(0, 1)}${val?.slice(1, val.length).toLowerCase()}`;
}

export function trimming(val, size = 54) {
  let capitalized = capitalize(val);

  return capitalized.length > size
    ? `${capitalized?.slice(0, size)}...`
    : capitalized;
}

export function random() {
  return (Math.random() + 100).toString(36).substring(1);
}

export let getExpiry = (hours) => {
  let now = new Date();
  return new Date(now.setHours(now.getHours() + hours));
};

export function Notify({ status = "", content = "..." }) {
  let config = {
    position: "bottom-right",
  };

  status ? toast[status](content, config) : toast(content, config);
}
