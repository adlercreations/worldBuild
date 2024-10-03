import React, { useState } from "react";

function CreateArtistProfile() {
    const [formData, setFormData] = useState({
        artist_name: "",
        bio: "",
        profile_image: "",
        user_id: 1
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        
        fetch("http://localhost:5555/api/portfolios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Artist profile created:", data);
                setFormData({
                    artist_name: "",
                    bio: "",
                    profile_image: "",
                    user_id: 1
                });
            })
            .catch((error) => console.error("Error creating profile:", error));
    };

    return (
        <div className="container">
            <h2>Create an Artist Profile</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Artist Name"
                    value={formData.artist_name}
                    onChange={(event) =>
                        setFormData({ ...formData, artist_name: event.target.value })
                    }
                />
                <textarea
                    type="text"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={(event) =>
                        setFormData({ ...formData, bio: event.target.value })
                    }
                ></textarea>
                <input
                    type="text"
                    placeholder="Profile Image URL"
                    value={formData.profile}
                    onChange={(event) =>
                        setFormData({ ...formData, profile_image: event.target.value })
                    }
                />
                <button type="submit">Create Profile</button>
            </form>
        </div>
    )
}

export default CreateArtistProfile;