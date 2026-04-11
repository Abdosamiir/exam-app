"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function HoveredLink(props: React.ComponentProps<typeof Link>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      prefetch={isHovered}
      {...props}
    />
  );
}
