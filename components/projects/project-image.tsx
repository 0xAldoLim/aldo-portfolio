import Image, { type ImageProps } from "next/image";

export function ProjectImage({ alt, ...props }: Omit<ImageProps, "alt"> & { alt: string }) {
  return <Image {...props} alt={alt} sizes={props.sizes ?? "(max-width: 768px) 100vw, 900px"} />;
}
