// Single-admin authorization helper
// Checks if the current auth object represents an admin user.

export function isSingleAdmin(auth) {
  if (!auth) return false;
  return auth.role === "ADMIN" && !!auth.token;
}
