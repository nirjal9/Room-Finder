import {useSelector} from "react-redux";
import type {RootState} from "../store";
import {useEffect, useState} from "react";
import axiosClient, {getCsrfToken} from "../api/axiosClient.ts";

interface RoomType {
    id: number;
    name: string;
    description: string;
}

function RoomForm() {
    const user = useSelector((state: RootState) => state.auth.user)
    const [form, setForm] = useState({
        description: '',
        location: '',
        district: '',
        province: '',
        rent: '',
        features: [] as (number | string)[],
        newFeature: '',
        room_type_id: '',
    });
    const [availableFeatures, setAvailableFeatures] = useState<{ id: number; name: string }[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isAddingFeature, setIsAddingFeature] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                await getCsrfToken();
                const [featuresRes, roomTypesRes] = await Promise.all([
                    axiosClient.get('/features'),
                    axiosClient.get('/room_types')
                ]);
                
                console.log('Raw features response:', featuresRes);
                console.log('Raw room types response:', roomTypesRes);
                
                // Handle the nested data structure
                const features = featuresRes.data?.data?.data || [];
                const types = roomTypesRes.data?.data?.data || [];
                
                console.log('Processed features:', features);
                console.log('Processed room types:', types);
                
                if (!Array.isArray(features)) {
                    console.error('Features is not an array:', features);
                    setError("Invalid features data received");
                    return;
                }
                
                setAvailableFeatures(features);
                setRoomTypes(types);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data");
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleAddFeature = async () => {
        const trimmed = form.newFeature.trim();
        if (!trimmed) return;

        setIsAddingFeature(true);
        try {
            // First, create the new feature
            const featureRes = await axiosClient.post('/features', {
                name: trimmed
            });
            
            // Add the new feature to available features
            const newFeature = featureRes.data.data;
            setAvailableFeatures(prev => [...prev, newFeature]);
            
            // Add the new feature ID to the form's features
            setForm(prev => ({
                ...prev,
                features: [...prev.features, newFeature.id.toString()],
                newFeature: ''
            }));
            
            setMessage("Feature added successfully");
        } catch (err) {
            console.error("Error adding feature:", err);
            setError("Failed to add feature. It might already exist.");
        } finally {
            setIsAddingFeature(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            // First, add any custom features
            const customFeatures = form.newFeature.trim().split(',').map(f => f.trim()).filter(f => f);
            const newFeatureIds = [];

            for (const featureName of customFeatures) {
                try {
                    const featureRes = await axiosClient.post('/features', {
                        name: featureName
                    });
                    const newFeature = featureRes.data.data;
                    newFeatureIds.push(newFeature.id.toString());
                    // Add the new feature to available features list
                    setAvailableFeatures(prev => [...prev, newFeature]);
                } catch (err) {
                    console.error(`Error adding feature "${featureName}":`, err);
                    // Continue with other features even if one fails
                }
            }

            // Get feature names for selected features
            const selectedFeatureNames = form.features.map(featureId => {
                const feature = availableFeatures.find(f => f.id.toString() === featureId.toString());
                return feature ? feature.name : '';
            }).filter(name => name);

            // Combine selected feature names with custom feature names
            const allFeatures = [...selectedFeatureNames, ...customFeatures];

            const payload = {
                ...form,
                rent: Number(form.rent),
                features: allFeatures,
                user_id: user?.id,
                room_type_id: Number(form.room_type_id),
            };
            console.log("Payload being sent:", payload);
            await axiosClient.post("/rooms", payload);
            setMessage("Room successfully added");
            setForm({
                description: '',
                location: '',
                district: '',
                province: '',
                rent: '',
                features: [] as (number | string)[],
                newFeature: '',
                room_type_id: '',
            });
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const error = err as { response: { status: number; data: { message?: string; errors?: Record<string, string[]> } } };
                console.error("Response status:", error.response.status);
                console.error("Validation errors:", error.response.data);
                setError(
                    error.response.data?.message ||
                    JSON.stringify(error.response.data.errors) ||
                    "Failed to add room"
                );
            } else {
                console.error("Unexpected error:", err);
                setError("Unexpected error");
            }
        }
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
                    <p className="text-red-500 font-semibold">
                         You must be logged in to add a room.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
                    <p className="text-gray-600">Loading data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Add New Room</h1>
            <div className="flex justify-center">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
                    {message && <p className="text-green-600 mb-4">{message}</p>}
                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-medium mb-2 text-lg">Room Type:</label>
                            <select
                                name="room_type_id"
                                value={form.room_type_id}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg text-lg"
                                required
                            >
                                <option value="">Select a room type</option>
                                {Array.isArray(roomTypes) && roomTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name} - {type.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg text-lg"
                            required
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={form.location}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg text-lg"
                            required
                        />
                        <input
                            type="text"
                            name="district"
                            placeholder="District"
                            value={form.district}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg text-lg"
                            required
                        />
                        <input
                            type="text"
                            name="province"
                            placeholder="Province"
                            value={form.province}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg text-lg"
                            required
                        />
                        <div>
                            <label className="block font-medium mb-2 text-lg">Select Features:</label>
                            <select
                                multiple
                                value={form.features.map(f => f.toString())}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions).map(
                                        (option) => option.value
                                    );
                                    setForm({ ...form, features: selectedOptions });
                                }}
                                className="w-full border p-3 rounded-lg text-lg"
                            >
                                {Array.isArray(availableFeatures) && availableFeatures.map((feature) => (
                                    <option key={feature.id} value={feature.id.toString()}>
                                        {feature.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-2 text-lg">Add Custom Features (comma-separated):</label>
                            <input
                                type="text"
                                placeholder="e.g. Rooftop Access, Garden View, Security Guard"
                                value={form.newFeature}
                                onChange={(e) => setForm({ ...form, newFeature: e.target.value })}
                                className="w-full border p-3 rounded-lg text-lg"
                            />
                            <p className="text-sm text-gray-500 mt-2">Enter multiple features separated by commas</p>
                        </div>
                        <input
                            type="number"
                            name="rent"
                            placeholder="Rent"
                            value={form.rent}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg text-lg"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Add Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RoomForm;