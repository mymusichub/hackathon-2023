import ArtworkGenerator from "./components/Artwork";
import Chat from "./components/Chat";

interface PageProps {}

export default async function Home({}: PageProps) {
  return (
    <div data-testid="home-page">
      {/* <Chat /> */}
      <ArtworkGenerator />
    </div>
  );
}
