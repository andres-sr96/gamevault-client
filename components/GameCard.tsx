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
      <div className="border p-4 mb-4 rounded hover:bg-gray-50 cursor-pointer">
        <img
          src={game.coverImageUrl || "/placeholder.png"}
          alt={game.title}
          className="w-full h-48 object-cover rounded mb-3"
        />
        <h2 className="text-xl font-semibold">{game.title}</h2>
        <p className="text-sm text-gray-500">{game.releaseYear}</p>
      </div>
    </Link>
  );
}
