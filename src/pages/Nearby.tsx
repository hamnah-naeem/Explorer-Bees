import { useState, useEffect, useRef, useCallback } from "react";
import { FiMapPin, FiNavigation } from "react-icons/fi";
import { Map } from "../components/Map";
import { PlacesList } from "../components/PlacesList";

type LatLngLiteral = { lat: number; lng: number };
type PlaceResult = google.maps.places.PlaceResult;

interface NearbyState {
  places: PlaceResult[];
  selectedPlace: PlaceResult | null;
  center: LatLngLiteral;
  loading: boolean;
  error: string | null;
  activeTab: "hotels" | "restaurants";
  mapLoaded: boolean;
  userLocationDenied: boolean;
}

const DEFAULT_CENTER: LatLngLiteral = { lat: 33.6844, lng: 73.0479 }; // Islamabad

const Nearby: React.FC = () => {
  const [state, setState] = useState<NearbyState>({
    places: [],
    selectedPlace: null,
    center: DEFAULT_CENTER,
    loading: true,
    error: null,
    activeTab: "hotels",
    mapLoaded: false,
    userLocationDenied: false,
  });

  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    placesService.current = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    setState((prev) => ({ ...prev, mapLoaded: true }));
  }, []);

  const fetchNearbyPlaces = useCallback(
    (lat: number, lng: number) => {
      if (!placesService.current) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      const request: google.maps.places.PlaceSearchRequest = {
        location: new window.google.maps.LatLng(lat, lng),
        radius: 10000, // 10 km
        type: state.activeTab === "hotels" ? "lodging" : "restaurant",
      };

      placesService.current.nearbySearch(
        request,
        (
          results: PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            setState((prev) => ({
              ...prev,
              places: results,
              loading: false,
            }));
          } else {
            setState((prev) => ({
              ...prev,
              error: `Failed to load places: ${status}`,
              loading: false,
            }));
          }
        }
      );
    },
    [state.activeTab]
  );

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: LatLngLiteral = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setState((prev) => ({
            ...prev,
            center: newCenter,
            userLocationDenied: false,
          }));
          fetchNearbyPlaces(newCenter.lat, newCenter.lng);
        },
        () => {
          setState((prev) => ({ ...prev, userLocationDenied: true }));
          fetchNearbyPlaces(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
        }
      );
    } else {
      fetchNearbyPlaces(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
    }
  }, [fetchNearbyPlaces]);

  const handleTabChange = (tab: "hotels" | "restaurants") => {
    setState((prev) => ({
      ...prev,
      activeTab: tab,
      loading: true,
      places: [],
      selectedPlace: null,
    }));
  };

  const handlePlaceSelect = (place: PlaceResult) => {
    setState((prev) => ({ ...prev, selectedPlace: place }));
    if (mapRef.current && place.geometry?.location) {
      mapRef.current.panTo(place.geometry.location);
    }
    if (cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCloseInfoWindow = () => {
    setState((prev) => ({ ...prev, selectedPlace: null }));
  };

  useEffect(() => {
    if (state.mapLoaded) {
      getUserLocation();
    }
  }, [state.mapLoaded, state.activeTab, getUserLocation]);

  const {
    places,
    selectedPlace,
    center,
    loading,
    error,
    activeTab,
    userLocationDenied,
  } = state;

  return (
    <div className="min-h-screen text-gray-800 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-3 font-serif">
          Discover Nearby Places
        </h2>
        <hr className="text-red-500 w-[100px] bg-yellow-500 mx-auto h-1 mb-10" />
        <p className="text-gray-600 text-2xl text-center">
          {activeTab === "hotels"
            ? "Find the best hotels in your area"
            : "Explore delicious dining options nearby"}
        </p>
      </header>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`flex items-center py-3 px-6 font-medium text-sm md:text-base transition-colors ${
            activeTab === "hotels"
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("hotels")}
        >
          <FiMapPin className="mr-2" />
          Hotels
        </button>
        <button
          className={`flex items-center py-3 px-6 font-medium text-sm md:text-base transition-colors ${
            activeTab === "restaurants"
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("restaurants")}
        >
          <FiNavigation className="mr-2" />
          Restaurants
        </button>
      </div>

      {/* Warning if location denied */}
      {userLocationDenied && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-yellow-700">
            Using default location. Enable location services for more accurate
            results.
          </p>
        </div>
      )}

      {/* Map */}
      <Map
        center={center}
        places={places}
        activeTab={activeTab}
        selectedPlace={selectedPlace}
        onMapLoad={handleMapLoad}
        onPlaceSelect={handlePlaceSelect}
        onCloseInfoWindow={handleCloseInfoWindow}
      />

      {/* Places list */}
      <div ref={cardsRef}>
        <PlacesList
          places={places}
          loading={loading}
          error={error}
          activeTab={activeTab}
          selectedPlace={selectedPlace}
          onPlaceSelect={handlePlaceSelect}
        />
      </div>
    </div>
  );
};

export default Nearby;
