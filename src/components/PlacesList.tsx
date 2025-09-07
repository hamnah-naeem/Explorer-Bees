import { FiMapPin, FiPhone, FiStar, FiClock } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface PlacesListProps {
  places: google.maps.places.PlaceResult[];
  loading: boolean;
  error: string | null;
  activeTab: "hotels" | "restaurants";
  selectedPlace: google.maps.places.PlaceResult | null;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

export const PlacesList: React.FC<PlacesListProps> = ({
  places,
  loading,
  error,
  activeTab,
  selectedPlace,
  onPlaceSelect,
}) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {activeTab === "hotels" ? "Nearby Hotels" : "Nearby Restaurants"}
        </h2>
        <span className="text-sm text-gray-500">
          {loading ? "Loading..." : `${places.length} places found`}
        </span>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <Skeleton height={20} width="80%" />
                <Skeleton height={16} width="60%" className="mt-2" />
                <Skeleton height={16} width="40%" className="mt-2" />
              </div>
            ))
        ) : places.length > 0 ? (
          places.map((place) => (
            <div
              key={place.place_id}
              className={`bg-white p-4 rounded-lg shadow transition-all cursor-pointer hover:shadow-md ${
                selectedPlace?.place_id === place.place_id
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => onPlaceSelect(place)}
            >
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-800">{place.name}</h3>
                {place.rating && (
                  <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                    <FiStar className="text-yellow-500 mr-1" size={14} />
                    <span className="text-sm font-medium">{place.rating}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1 flex items-center">
                <FiMapPin size={14} className="mr-1" />
                {place.vicinity}
              </p>
              {place.opening_hours && (
                <p className="text-sm mt-2 flex items-center">
                  <FiClock size={14} className="mr-1" />
                  {place.opening_hours.isOpen?.() ? (
                    <span className="text-green-600">Open Now</span>
                  ) : (
                    <span className="text-red-600">Closed</span>
                  )}
                </p>
              )}
              {(place as any).phone && (
                <div className="mt-2 flex items-center">
                  <FiPhone size={14} className="mr-1 text-gray-600" />
                  <a
                    href={`tel:${(place as any).phone}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {(place as any).phone}
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center col-span-full">
            <p className="text-gray-500">No {activeTab} found in this area</p>
          </div>
        )}
      </div>
    </div>
  );
};
