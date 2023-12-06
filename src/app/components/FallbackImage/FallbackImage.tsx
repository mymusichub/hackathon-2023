"use client";

import Image, { ImageProps } from "next/image";
import React, { useEffect, useState } from "react";

interface FallbackImageProps extends ImageProps {
  fallbackSrc?: string;
}

const FallbackImage: React.FC<FallbackImageProps> = ({
  fallbackSrc,
  src,
  ...props
}) => {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false);
  }, [src])

  return (
    <Image
      {...props}
      onError={() => {
        setError(true);
      }}
      fill
      style={{
        objectFit: 'cover',
      }}
      src={(error ? fallbackSrc : src) ?? ""}
      unoptimized
    />
  )
}

export default FallbackImage;