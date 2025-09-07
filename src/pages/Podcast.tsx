import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { podcasts, type Podcast } from "../dummy-data/podcast-data";
import PodcastDetailPage from "../components/podcast-detail-page";

const Podcast: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Podcast[]>([]);
  const [recommendedIndex, setRecommendedIndex] = useState<number>(0);
  const [popularIndex, setPopularIndex] = useState<number>(0);

  const filteredPodcasts = podcasts.filter(
    (podcast) =>
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularPodcasts: Podcast[] = [...podcasts]
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  const handlePodcastClick = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== podcast.id);
      return [podcast, ...filtered].slice(0, 6);
    });
  };

  const nextRecommended = () =>
    setRecommendedIndex((prev) => (prev + 3) % filteredPodcasts.length);

  const prevRecommended = () =>
    setRecommendedIndex((prev) =>
      prev === 0 ? Math.max(0, filteredPodcasts.length - 3) : prev - 3
    );

  const nextPopular = () =>
    setPopularIndex((prev) => (prev + 3) % popularPodcasts.length);

  const prevPopular = () =>
    setPopularIndex((prev) =>
      prev === 0 ? Math.max(0, popularPodcasts.length - 3) : prev - 3
    );

  if (selectedPodcast) {
    return (
      <PodcastDetailPage
        podcast={selectedPodcast}
        onBack={() => setSelectedPodcast(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-4 text-white">Podcasts</h1>
          <p className="text-white text-xl opacity-90 max-w-2xl mx-auto">
            Discover amazing stories and insights from the world's best
            storytellers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="relative mb-12 max-w-md mx-auto">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Recommended Section */}
        <SectionCarousel
          title="Recommended for today"
          podcasts={filteredPodcasts}
          index={recommendedIndex}
          onPrev={prevRecommended}
          onNext={nextRecommended}
          handleClick={handlePodcastClick}
        />

        {/* Most Popular Section */}
        <SectionCarousel
          title="Most Popular of the Week"
          podcasts={popularPodcasts}
          index={popularIndex}
          onPrev={prevPopular}
          onNext={nextPopular}
          handleClick={handlePodcastClick}
        />

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Recently viewed
              </h2>
              <button className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                Show all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyViewed.map((podcast) => (
                <PodcastCard
                  key={`recent-${podcast.id}`}
                  podcast={podcast}
                  onClick={() => handlePodcastClick(podcast)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

interface SectionCarouselProps {
  title: string;
  podcasts: Podcast[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
  handleClick: (podcast: Podcast) => void;
}

const SectionCarousel: React.FC<SectionCarouselProps> = ({
  title,
  podcasts,
  index,
  onPrev,
  onNext,
  handleClick,
}) => (
  <section className="mb-12">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all border border-gray-200 hover:bg-gray-50"
          disabled={index === 0}
        >
          <ChevronLeft
            size={20}
            className={index === 0 ? "text-gray-300" : "text-gray-600"}
          />
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all border border-gray-200 hover:bg-gray-50"
          disabled={index + 3 >= podcasts.length}
        >
          <ChevronRight
            size={20}
            className={
              index + 3 >= podcasts.length ? "text-gray-300" : "text-gray-600"
            }
          />
        </button>
      </div>
    </div>

    <div className="overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${(index / 3) * 100}%)` }}
      >
        {Array.from({ length: Math.ceil(podcasts.length / 3) }).map(
          (_, groupIndex) => (
            <div
              key={groupIndex}
              className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {podcasts
                .slice(groupIndex * 3, (groupIndex + 1) * 3)
                .map((podcast) => (
                  <PodcastCard
                    key={podcast.id}
                    podcast={podcast}
                    onClick={() => handleClick(podcast)}
                  />
                ))}
            </div>
          )
        )}
      </div>
    </div>
  </section>
);

interface PodcastCardProps {
  podcast: Podcast;
  onClick: () => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast, onClick }) => (
  <div
    className="bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-gray-100"
    onClick={onClick}
  >
    <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
      <img
        src={podcast.image}
        alt={podcast.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="space-y-3">
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-1">
          {podcast.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {podcast.description}
        </p>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span className="font-medium">{podcast.episodes} episodes</span>
        <span>{podcast.duration}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
          {podcast.category}
        </span>
        <span className="text-xs text-gray-500">by {podcast.host}</span>
      </div>
    </div>
  </div>
);

export default Podcast;
