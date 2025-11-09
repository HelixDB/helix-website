import { headers } from 'next/headers';
import { EllmoApi, getPathnameFromHeaders } from 'ellmo-ai-react';

export async function EllmoContent() {
  // Get the pathname from headers (set by middleware if configured)
  const headersList = await headers();
  const pathname = getPathnameFromHeaders(headersList) || '/';

  // EllmoApi is a server component that fetches data during server rendering
  return <EllmoApi clientId="e6f68920-29cb-4fa0-af04-a88a4203dca3" url={pathname} type="semantic" />;
}

