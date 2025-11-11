"use client";
import { useRouter } from "next/navigation";

const ArtistLink = ({ artist }: { artist: any }) => {
  const router = useRouter();
  const NavigateToArtist = () => router.push(`/artists/${artist.id}`);

  return (
    <span className="font-medium cursor-pointer" onClick={NavigateToArtist}>
      {artist.name}
    </span>
  );
};

export default ArtistLink;
