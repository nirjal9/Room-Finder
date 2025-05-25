import './App.css'
import RoomList from "./components/RoomList.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./components/Register.tsx";
import Login from "./components/Login.tsx";
import UserInfo from "./components/UserInfo.tsx";
import Navbar from "./components/Navbar.tsx";
import RoomForm from "./components/RoomForm.tsx";
import Favourites from "./components/Favourites";
import { Provider } from "react-redux";
import { store } from "./store";

function App() {

    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-100 p-6">
                    <Navbar />
                    <UserInfo />
                    <Routes>
                        <Route path="/add-room" element={<RoomForm />} />
                        <Route path="/" element={<RoomList />} />
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/favourites" element={<Favourites />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </Provider>
    );

}

export default App
