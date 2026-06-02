import Link from "next/link";

type Props = {
  game: {
    id: number;
    title: string;
    coverImageUrl: string;
    releaseYear: string;
  };
};

export default function GameCard({ game }: Props) {
  return (
    <Link href={`/games/${game.id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer bg-white">
        <img
          src={game.coverImageUrl || "/placeholder.png"}
          alt={game.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-3">
          <h2 className="text-lg font-semibold truncate">{game.title}</h2>
          <p className="text-sm text-gray-500">{game.releaseYear}</p>
        </div>
      </div>
    </Link>
  );
}
