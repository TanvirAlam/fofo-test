export const API_VERSIONS = {
  V0: 'v0',
  V1: 'v1',
  LATEST: 'v1',
} as const;

export type ApiVersion = typeof API_VERSIONS[keyof typeof API_VERSIONS];

export function extractVersionFromPath(path: string): ApiVersion | null {
  const versionMatch = path.match(/^\/api\/(v\d+)/);
  return versionMatch ? (versionMatch[1] as ApiVersion) : null;
}

export function isVersionDeprecated(version: ApiVersion): boolean {
  return version === API_VERSIONS.V0;
}

export function getDeprecationInfo(version: ApiVersion) {
  if (version === API_VERSIONS.V0) {
    return {
      deprecated: true,
      sunsetDate: '2025-06-01',
      message: 'API v0 is deprecated. Please migrate to v1.',
      migrationGuide: '/docs/migration/v0-to-v1',
    };
  }
  return { deprecated: false };
}
