import axiosClient from "../api/axiosClient.ts";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourite } from "../store/slices/favouriteSlice";
import type { RootState } from "../store";

interface Props {
    roomId: number;
}

export default function FavouriteButton({ roomId }: Props) {
    const dispatch = useDispatch();
    const favourites = useSelector((state: RootState) => state.favourites.favourites);
    const isFavorited = favourites.includes(roomId);

    const handleToggleFavourite = async () => {
        try {
            await axiosClient.post('/favourites/toggle', { room_id: roomId });
            dispatch(toggleFavourite(roomId));
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <button 
            onClick={handleToggleFavourite} 
            title={isFavorited ? "Unfavorite" : "Favorite"}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            {isFavorited ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
    );
}