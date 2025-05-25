import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import axiosClient from "../api/axiosClient.ts";
import FavouriteButton from "./FavouriteButton.tsx";

interface Feature {
    id: number;
    name: string;
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
    user?: {
        id: number;
        name: string;
    };
}

function Favourites() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const favourites = useSelector((state: RootState) => state.favourites.favourites);

    useEffect(() => {
        async function fetchFavouriteRooms() {
            try {
                const res = await axiosClient.get('/rooms');
                const allRooms = res.data.data?.data || [];
                // Filter rooms to only show favorited ones
                const favouriteRooms = allRooms.filter((room: Room) => 
                    favourites.includes(room.id)
                );
                setRooms(favouriteRooms);
            } catch (err) {
                console.error("Error fetching favourite rooms:", err);
                setError("Failed to load favourite rooms");
            } finally {
                setLoading(false);
            }
        }

        fetchFavouriteRooms();
    }, [favourites]);

    if (loading) return <div>Loading favourite rooms...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Favourite Rooms</h1>
            {rooms.length === 0 ? (
                <p>No favourite rooms yet. Start adding some!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">{room.description}</h2>
                                    <p className="text-gray-600 mb-1">📍 {room.location}</p>
                                    <p className="text-gray-600 mb-1">🏘️ {room.district}, {room.province}</p>
                                    <p className="text-green-600 font-semibold">💰 Rs. {room.rent}</p>
                                </div>
                                <FavouriteButton roomId={room.id} />
                            </div>

                            {room.features && room.features.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold mb-2">Features:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {room.features.map((feature) => (
                                            <span
                                                key={feature.id}
                                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                            >
                                                {feature.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {room.images && room.images.length > 0 && (
                                <div className="mt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        {room.images.map((image) => (
                                            <img
                                                key={image.id}
                                                src={`http://localhost:8000${image.image_path}`}
                                                alt="Room"
                                                className="w-full h-32 object-cover rounded-md border"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {room.user && (
                                <p className="text-xs text-gray-400 mt-4">
                                    📤 Posted by: <strong>{room.user.name}</strong>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favourites; 