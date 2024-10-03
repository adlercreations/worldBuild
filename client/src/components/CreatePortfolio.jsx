import React, { useState } from 'react';

function CreatePortfolio({ userId }) {
    const [formData, setFormData] = useState({
        artist_name: '',
        bio: '',
        user_id: userId || 1,
    });
    const [profileImage, setProfileImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const MAX_FILE_SIZE = 10 * 1024 * 1024; 

    const handleSubmit = (event) => {
        event.preventDefault();

        if (profileImage && profileImage.size > MAX_FILE_SIZE) {
            setErrorMessage('File size too large. Maximum is 10MB.');
            return;
        }

        const dataToSubmit = new FormData();
        dataToSubmit.append('artist_name', formData.artist_name);
        dataToSubmit.append('bio', formData.bio);
        dataToSubmit.append('user_id', formData.user_id);
        if (profileImage) {
            dataToSubmit.append('profile_image', profileImage);
        }

        console.log("Submitting portfolio data:", profileImage, dataToSubmit);

        fetch('http://localhost:5555/api/portfolios', {
            method: 'POST',
            body: dataToSubmit,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('HTTP error! status: ${response.status}');
            }
            return response.json();
        })
        .then(data => {
            console.log('Portfolio created:', data);
            // Reset the form or show a success message
            setFormData({
                artist_name: '',
                bio: '',
                user_id: userId || 1,
            });
            setProfileImage(null);
            setErrorMessage('');
        })
        .catch(error => {
            console.error('Error creating portfolio:', error);
            setErrorMessage('Failed to create portfolio. Please try again.');
        });
    };
    return (
        <div className="container">
            <h2>Create a New Portfolio</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Artist Name"
                    value={formData.artist_name}
                    onChange={(event) => setFormData({ ...formData, artist_name: event.target.value })}
                    required
                />
                <textarea
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
                    required
                />
                <input
                    type="file"
                    onChange={(event) => setProfileImage(event.target.files[0])}
                />
                <button type="submit">Create Portfolio</button>
            </form>
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
}

export default CreatePortfolio;



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// function CreatePortfolio({ userId }) {
//   const [formData, setFormData] = useState({
//     artist_name: '',
//     bio: '',
//     profile_image: '',
//   });

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const dataToSubmit = {
//       ...formData,
//       user_id: userId,  // Link the portfolio to the logged-in user
//     };

//     // Make the POST request to create a new portfolio
//     fetch('http://localhost:5555/api/portfolios', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(dataToSubmit),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('Portfolio created:', data);
//         // Optionally reset the form
//         setFormData({
//           artist_name: '',
//           bio: '',
//           profile_image: '',
//         });
//       })
//       .catch((error) => console.error('Error creating portfolio:', error));
//   };

//   return (
//     <div className='container'>
//       <h2>Create a New Portfolio</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Artist Name"
//           value={formData.artist_name}
//           onChange={(event) => setFormData({ ...formData, artist_name: event.target.value })}
//           required
//         />
//         <textarea
//           placeholder="Bio"
//           value={formData.bio}
//           onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
//           required
//         ></textarea>
//         <input
//           type="text"
//           placeholder="Profile Image URL"
//           value={formData.profile_image}
//           onChange={(event) => setFormData({ ...formData, profile_image: event.target.value })}
//         />
//         <button type="submit">Create Portfolio</button>
//       </form>
//       <Link to="/portfolios">Back to Portfolios</Link>
//     </div>
//   );
// }

// export default CreatePortfolio;