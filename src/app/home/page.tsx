import { Metadata } from "next";
import { notFound } from "next/navigation";
import Playground from "../components/Playground/playground";

interface PageProps {}

export async function generateMetadata({}: PageProps): Promise<Metadata> {
  return {
    title: "TITLE",
    description: "DESCRIPTION",
    applicationName: "PROJECT_NAME",
    openGraph: {
      title: "TITLE",
      description: "DESCRIPTION",
    },
    twitter: {
      card: "summary_large_image",
      title: "TITLE",
      description: "DESCRIPTION",
    },
    icons: {
      icon: "https://global-uploads.webflow.com/5f045d2f34d91988db9ec750/5f157bcab9588c204dd98fcd_Favicon.png",
    },
  };
}

export default async function Home({}: PageProps) {
  return (
    <div data-testid="home-page">
      TEMPLATE - HOME
      <Playground />
    </div>
  );
}
