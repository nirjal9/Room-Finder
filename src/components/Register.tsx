
import {useState} from "react";
import axiosClient from "../api/axiosClient.ts";

function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone:'',
        password: '',
        password_confirmation: '',
        role:''
    });

    const [error, setError] = useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);


        try {
            const payload ={
                ...form,
                role:Number(form.role),
            }
            // await axiosClient.get('/sanctum/csrf-cookie');
            await axiosClient.post('/signupUser', payload);
            alert("Registered successfully!");
        } catch (err: any) {
            if (err.response?.status === 422) {
                console.error("Validation errors:", err.response.data.errors);
                setError("Validation failed. Please check your inputs.");
            } else {
                console.error(err);
                setError("Registration failed. Please try again later.");
            }
        }

    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-4">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                    >
                        <option value="">-- Select Role --</option>
                        <option value="1">Owner</option>
                        <option value="2">Tenant</option>
                </select>
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                    />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}
export default Register;