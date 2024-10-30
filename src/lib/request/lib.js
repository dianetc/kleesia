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
