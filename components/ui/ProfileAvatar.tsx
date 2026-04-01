"use client";

import type { Profile } from "@/lib/types";
import { avatarUrl } from "@/lib/utils";

/**
 * User avatars must not use next/image: OAuth URLs and arbitrary hosts
 * still fail SSR checks in production. Native img avoids that entirely.
 */
export default function ProfileAvatar({
  profile,
  size,
  className = "w-full h-full object-cover",
}: {
  profile: Pick<Profile, "avatar_url" | "full_name">;
  size: number;
  className?: string;
}) {
  const raw = profile.avatar_url?.trim();
  const src = raw || avatarUrl(profile.full_name ?? "");

  return (
    <img
      src={src}
      alt={profile.full_name || "Profile"}
      width={size}
      height={size}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}
