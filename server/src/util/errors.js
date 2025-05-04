// utils/errors.js

function BaseError(message, statusCode = 400, name = "CustomError") {
  const error = new Error(message);
  error.name = name;
  error.statusCode = statusCode;
  Error.captureStackTrace?.(error, BaseError);
  return error;
}

// ✅ Specific Error Generators

function SlugAlreadyExists(slug) {
  return BaseError(
    `The slug "${slug}" is already in use.`,
    409,
    "SlugAlreadyExists",
  );
}

function ShortURLNotFound(slug) {
  return BaseError(
    `Short URL with slug "${slug}" was not found.`,
    404,
    "ShortURLNotFound",
  );
}

function ShortLinkHasExpired(slug) {
  return BaseError(
    `The short link "${slug}" has expired.`,
    410,
    "ShortLinkHasExpired",
  );
}

function InvalidUrlFormat(url = "") {
  const baseMessage = "The provided URL has an invalid format.";
  return BaseError(
    url ? `${baseMessage} Received: "${url}".` : baseMessage,
    400,
    "InvalidUrlFormat",
  );
}

export {
  SlugAlreadyExists,
  ShortURLNotFound,
  ShortLinkHasExpired,
  InvalidUrlFormat,
  BaseError,
};
