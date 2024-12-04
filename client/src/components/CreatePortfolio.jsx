import React, { useState, useEffect } from 'react';

function CreatePortfolio({ userId }) {
    console.log('CreatePortfolio rendering with userId:', userId); // Debug render

    useEffect(() => {
        console.log('CreatePortfolio mounted'); // Debug lifecycle
        return () => console.log('CreatePortfolio unmounted');
    }, []);

    const [formData, setFormData] = useState({
        artist_name: '',
        bio: '',
        user_id: userId || 1,
    });
    const [profileImage, setProfileImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const MAX_FILE_SIZE = 10 * 1024 * 1024; 

    const handleFileChange = (event) => {
        event.preventDefault(); // Prevent any default behavior
        console.log('handleFileChange triggered');
        console.log('Event:', event);
        console.log('Target:', event.target);
        
        const fileInput = event.target;
        console.log('Files:', fileInput.files);
        
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            console.log('Selected file:', file);
            
            if (file.size > MAX_FILE_SIZE) {
                setErrorMessage('File size too large. Maximum is 10MB.');
                return;
            }
            setProfileImage(file);
            setErrorMessage('');
        } else {
            console.log('No file selected');
        }
    };

    const handleClick = (event) => {
        console.log('File input clicked');
        // Explicitly trigger the file dialog
        event.target.value = null; // Clear the input
        event.target.click();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form submission started'); // Debug log

        const formDataToSend = new FormData();
        formDataToSend.append('artist_name', formData.artist_name);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('user_id', formData.user_id);
        
        if (profileImage) {
            formDataToSend.append('profile_image', profileImage);
        }

        try {
            console.log('Sending data to server:', formDataToSend); // Debug log
            const response = await fetch('http://localhost:5555/api/portfolios', {
                method: 'POST',
                credentials: 'include',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create portfolio');
            }

            const data = await response.json();
            console.log('Server response:', data); // Debug log
            
            // Clear form after successful submission
            setFormData({
                artist_name: '',
                bio: '',
                user_id: userId || 1,
            });
            setProfileImage(null);
            setErrorMessage('');

        } catch (error) {
            console.error('Error creating portfolio:', error); // Debug log
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="container">
            <h2>Create a New Portfolio</h2>
            <form onSubmit={handleSubmit} className="create-portfolio-form" encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="artist_name">Artist Name</label>
                    <input
                        id="artist_name"
                        name="artist_name"
                        type="text"
                        placeholder="Artist Name"
                        value={formData.artist_name}
                        onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profile_image">Profile Image</label>
                    <input
                        id="profile_image"
                        name="profile_image"
                        type="file"
                        onChange={handleFileChange}
                        onClick={handleClick}
                        accept="image/*"
                        style={{ 
                            cursor: 'pointer',
                            display: 'block',
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            zIndex: 1000 // Ensure it's above other elements
                        }}
                    />
                </div>

                <button type="submit">Create Portfolio</button>
            </form>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <div style={{ marginTop: '20px', color: 'white' }}>
                <p>Debug Info:</p>
                <p>Profile Image State: {profileImage ? profileImage.name : 'No file selected'}</p>
                <p>User ID: {userId}</p>
            </div>
        </div>
    );
}

export default CreatePortfolio;