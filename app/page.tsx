import GameRow from "@/components/GameRow";
import HeroBanner from "@/components/HeroBanner";

export default function Home() {
  return (
    <main className="w-full pt-24">
      <HeroBanner />
      <GameRow
        title="⌛ Anticipated Games"
        subtitle="Keep tabs on what is currently launching across all platforms next."
        fetchType="upcoming"
      />
      <GameRow
        title="🔥 Trending Games"
        subtitle="The most added, rated, and discussed titles in the community this month."
        fetchType="trending"
      />
    </main>
  );
}
