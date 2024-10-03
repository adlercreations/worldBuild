import React, { useState } from "react";

function CreateCreatorProfile() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        
        fetch("http://localhost:5555/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Creator profile created:", data);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                });
            })
            .catch((error) => console.error("Error creating profile:", error));
    };

    return (
        <div className="container">
            <h2>Create a Creator Profile</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(event) =>
                        setFormData({ ...formData, username: event.target.value })
                    }
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(event) =>
                        setFormData({ ...formData, email: event.target.value })
                    }
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(event) =>
                        setFormData({ ...formData, password: event.target.value })
                    }
                />
                <button type="submit">Create Profile</button>
            </form>
        </div>
    );
}

export default CreateCreatorProfile;