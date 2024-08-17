export function getParams(query) {
  let options = { where: {}, select: {} };

  Object?.entries(query)?.forEach(([key, value]) => {
    if (key !== "rtf") options.where[key] = value;

    let return_fields = query?.rtf.split(",");
    return_fields?.forEach((rtf) => {
      options.select[rtf] = true;
    });
  });

  let filter_length = Object.keys(options?.where).length;
  let rtf_length = Object.keys(options?.select).length;

  return rtf_length > 0 || filter_length > 0 ? options : false;
}
