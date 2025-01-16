function paramsValidator(params) {
  if (
    !params.message ||
    !params.message.text ||
    !params.message.sender ||
    !params.message.sender.displayName
  ) {
    return false;
  }
  return true;
}

module.exports = { paramsValidator };
