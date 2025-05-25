import axiosClient from "../api/axiosClient.ts";
import {useEffect, useState} from "react";
import FavouriteButton from "./FavouriteButton.tsx";
import { useDispatch } from "react-redux";
import { setFavourites } from "../store/slices/favouriteSlice";

interface Feature {
    id: number;
    name: string;
}

interface RoomType {
    id: number;
    name: string;
    description: string;
}

interface Room {
    id: number;
    description: string;
    location: string;
    district: string;
    province: string;
    rent: string;
    features: Feature[];
    images: { id: number; image_path: string }[];
    is_favorited: boolean;
    room_type: RoomType;
    user?: {
        id: number;
        name: string;
    };
}

function RoomList() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchRooms() {
            try {
                console.log("Fetching rooms...");
                const res = await axiosClient.get('/rooms');
                console.log("Rooms response:", res.data);
                
                // Handle the nested data structure
                const roomsData = res.data.data?.data || [];
                console.log("Processed rooms data:", roomsData);
                
                setRooms(roomsData);
                
                // Initialize favorites from rooms that are marked as favorited
                const initialFavorites = roomsData
                    .filter((room: Room) => room.is_favorited)
                    .map((room: Room) => room.id);
                
                console.log("Initial favorites from rooms:", initialFavorites);
                
                // Fetch favorites from API and merge with initial state
                try {
                    console.log("Fetching favorites from API...");
                    const favRes = await axiosClient.get('/favourites');
                    console.log("Favorites API response:", favRes.data);
                    const apiFavorites = favRes.data.data.favourites.map((fav: any) => fav.room_id);
                    // Merge both sets of favorites, removing duplicates
                    const allFavorites = [...new Set([...initialFavorites, ...apiFavorites])];
                    console.log("Merged favorites:", allFavorites);
                    dispatch(setFavourites(allFavorites));
                } catch (err) {
                    console.error("Error fetching favourites:", err);
                    // If API call fails, still use the initial favorites from rooms
                    dispatch(setFavourites(initialFavorites));
                }
            } catch (err) {
                console.error("Error fetching rooms:", err);
                setError("Failed to load rooms");
            } finally {
                setLoading(false);
            }
        }

        fetchRooms();
    }, [dispatch]);

    if (loading) return <div>Loading rooms...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Available Rooms</h1>
            {rooms.length === 0 ? (
                <p>No rooms available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-2 flex-1">
                                    <h2 className="text-xl font-semibold text-gray-800">{room.description}</h2>
                                    <div className="space-y-1">
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <span>📍</span> {room.location}
                                        </p>
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <span>🏘️</span> {room.district}, {room.province}
                                        </p>
                                        <p className="text-green-600 font-semibold flex items-center gap-2">
                                            <span>💰</span> Rs. {room.rent}
                                        </p>
                                        <p className="text-blue-600 font-semibold flex items-center gap-2">
                                            <span>🏠</span> {room.room_type?.name}
                                        </p>
                                    </div>
                                </div>
                                <FavouriteButton roomId={room.id} />
                            </div>

                            {room.features && room.features.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Features:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {room.features.map((feature) => (
                                            <span
                                                key={feature.id}
                                                className="bg-gray-100 text-gray-800 text-xs px-3 py-1.5 rounded-full"
                                            >
                                                {feature.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {room.images && room.images.length > 0 && (
                                <div className="mb-6">
                                    <div className="grid grid-cols-2 gap-3">
                                        {room.images.map((image) => (
                                            <img
                                                key={image.id}
                                                src={`http://localhost:8000${image.image_path}`}
                                                alt="Room"
                                                className="w-full h-40 object-cover rounded-lg border"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {room.user && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <span>📤</span> Posted by: <strong className="text-gray-700">{room.user.name}</strong>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RoomList;

