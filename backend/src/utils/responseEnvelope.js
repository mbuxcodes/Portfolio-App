/**
 * Implements the exact response envelopes defined in Architecture Doc 3.
 * Every controller uses these instead of calling res.json() directly, so
 * the response shape can never drift from the documented contract.
 */
export function success(
  res,
  { data = null, message = "Success", statusCode = 200 } = {},
) {
  return res.status(statusCode).json({ success: true, data, message });
}

export function error(
  res,
  {
    message = "An error occurred",
    statusCode = 500,
    errorCode = "ERROR",
    fields,
  } = {},
) {
  const body = { success: false, error: errorCode, message, statusCode };
  if (fields) body.fields = fields;
  return res.status(statusCode).json(body);
}
