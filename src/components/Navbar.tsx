import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import type { RootState } from "../store";
import {logout} from "../store/slices/authSlice";
import axiosClient from "../api/axiosClient";

function Navbar() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosClient.post('/logout');
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        {user?.roles?.[0]?.name === "owner" && (
                            <Link to="/add-room" className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Add Room
                            </Link>
                        )}
                        {user && (
                            <Link to="/favourites" className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Favourites
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Welcome, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;