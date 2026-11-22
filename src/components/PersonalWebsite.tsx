import { safeWebsiteUrl } from '../utils/website';

export default function PersonalWebsite({ url, name }: { url?: string; name: string }) {
  const href = safeWebsiteUrl(url);
  if (!href) return null;
  return (
    <a className="pill personal-website" href={href} target="_blank" rel="noopener noreferrer">
      Visit personal website <span aria-hidden="true">↗</span>
      <span className="sr-only"> for {name} (opens in a new tab)</span>
    </a>
  );
}
