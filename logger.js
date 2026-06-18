const formatMessage = (level, message) => {
  return `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`;
};

function info(message) {
  console.log(formatMessage("info", message));
}

function error(message, err) {
  if (err) {
    console.error(formatMessage("error", message), err);
  } else {
    console.error(formatMessage("error", message));
  }
}

module.exports = { info, error };