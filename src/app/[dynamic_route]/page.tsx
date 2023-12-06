import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

async function getData(slug: string): Promise<any | undefined> {
  const response = await fetch(`${process.env.API_URL}/${slug}`, {
    cache: "no-store",
  });
  if (response.ok) {
    return await response.json();
  }
  notFound();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const data = await getData(params.slug);
  const images = data?.coverImageUrl ? [data?.coverImageUrl] : [];

  return {
    title: "TITLE",
    description: "DESCRIPTION",
    applicationName: "PROJECT_NAME",
    openGraph: {
      title: "TITLE",
      description: "DESCRIPTION",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: "TITLE",
      description: "DESCRIPTION",
      images,
    },
    icons: {
      icon: "https://global-uploads.webflow.com/5f045d2f34d91988db9ec750/5f157bcab9588c204dd98fcd_Favicon.png",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const response = await getData(params.slug);
  return <div data-testid='page'> TEMPLATE </div>;
}
