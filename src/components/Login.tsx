import {useState} from "react";
import axiosClient, {getCsrfToken} from "../api/axiosClient.ts";
import {useDispatch} from "react-redux";
import {setUser} from "../store/slices/authSlice.ts";
import {useNavigate} from "react-router-dom";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            // Get CSRF token first
            await getCsrfToken();
            
            // Then attempt login
            console.log('Attempting login with:', form);
            const res = await axiosClient.post("/login", form);
            console.log('Login response:', res.data);
            
            if (res.data.success && res.data.user) {
                dispatch(setUser({ 
                    user: res.data.user,
                    token: res.data.result?.token || res.data.token // Try both possible locations
                }));
                navigate('/'); // Redirect to home page after successful login
            } else {
                console.error('Invalid response structure:', res.data);
                setError('Invalid response from server');
            }
        } catch (err: any) {
            console.error('Login error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                headers: err.response?.headers
            });
            setError(err.response?.data?.message || 'Login failed. Please check your credentials');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
export default Login;