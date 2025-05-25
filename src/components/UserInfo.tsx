// import {useEffect, useState} from "react";
// import {getLoggedInUser} from "../api/user.ts";
//
// interface User {
//     id: number;
//     name: string;
//     email: string;
// }
//
// function UserInfo() {
//     const [user, setUser] = useState<User|null>(null);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         getLoggedInUser()
//             .then(data => setUser(data))
//             .catch(err => console.log(err))
//             .finally(() => setLoading(false));
//     },[])
//     if(loading) return <p>Loading user...</p>;
//     if(!user) return <p className="test-red-500">Not logged in</p>;
//
//     return(
//         <div className="bg-white p-4 mb-4 shadow rounded">
//             <p className="text-sm text-gray-700">
//                 Logged in as: <strong>{user.name}</strong>({user.email})
//             </p>
//         </div>
//     );
// }
//
// export default UserInfo;

import { useSelector } from "react-redux";
import type {RootState} from "../store";

function UserInfo() {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) return <p className="text-red-500">Not logged in</p>;

    return (
        <div className="bg-white p-4 mb-4 shadow rounded">
            <p className="text-sm text-gray-700">
                👤 Logged in as: <strong>{user.name}</strong> ({user.email})
            </p>
        </div>
    );
}

export default UserInfo;
