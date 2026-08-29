export function getRequiredRuntimeValue(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured in the live environment. Set it before using the production admin command center.`);
  }

  return value;
}
