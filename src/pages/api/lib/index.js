export function getParams(query) {
  let options = { where: {}, select: {} };

  Object?.entries(query)?.forEach(([key, value]) => {
    if (!key.match(/(q|rtf)/)) {
      key.match(/\[\]/)
        ? (options.where[key.replace("[]", "")] = { has: value })
        : key.match(/\*/)
        ? (options.where[key.replace("*", "")] = { contains: value })
        : (options.where[key] = value);
    }
  });

  let return_fields = query.rtf ?? "";

  if (return_fields)
    return_fields?.split(",")?.forEach((rtf) => {
      let field = rtf.match(/=/) ? rtf.split("=") : rtf;
      if (typeof field === "object" && field?.length > 0) {
        options.select[field[0]] = { select: { [field[1]]: true } };
      } else {
        options.select[field] = true;
      }
    });

  return checkParams(options) ? options : {};
}

let checkParams = (options) => {
  let checkLength = (obj) => obj && Object.keys(obj).length > 0;

  let filter_length = checkLength(options?.where);
  let rtf_length = checkLength(options?.select);

  return filter_length || rtf_length;
};
