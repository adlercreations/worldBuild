import React, { useState } from 'react';

function CreateProject({ userId }) {
    const [formData, setFormData] = useState({
        project_title: '',
        description: '',
        keywords: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSubmit = {
            ...formData,
            user_id: userId  // Passing the user ID
        };

        fetch('http://localhost:5555/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSubmit),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Project created:', data);
            // Reset the form or show a success message
            setFormData({
                project_title: '',
                description: '',
                keywords: ''
            });
        })
        .catch((error) => console.error('Error creating project:', error));
    };

    return (
        <div className='container'>
            <h2>Create a New Project</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Project Title"
                    value={formData.project_title}
                    onChange={(event) => setFormData({ ...formData, project_title: event.target.value })}
                    required
                />
                <textarea
                    placeholder="Project Description"
                    value={formData.description}
                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                    required
                ></textarea>
                <input
                    type="text"
                    placeholder="Keywords (optional)"
                    value={formData.keywords}
                    onChange={(event) => setFormData({ ...formData, keywords: event.target.value })}
                />
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
}

export default CreateProject;



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// function CreateProject({ userId }) {
//     const [formData, setFormData] = useState({
//         project_title: '',
//         description: '',
//         keywords: '',
//         project_image: null
//     });

//     const handleImageChange = (event) => {
//         setFormData({ ...formData, project_image: event.target.files[0] });
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();

//         const dataToSubmit = new FormData();
//         dataToSubmit.append('project_title', formData.project_title);
//         dataToSubmit.append('description', formData.description);
//         dataToSubmit.append('keywords', formData.keywords);
//         dataToSubmit.append('user_id', userId);
//         dataToSubmit.append('project_image', formData.project_image);

//         // Make the POST request to create a new project
//         fetch('http://localhost:5555/api/projects', {
//             method: 'POST',
//             body: dataToSubmit,
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log('Project created:', data);
//                 // Optionally reset the form
//                 setFormData({
//                     project_title: '',
//                     description: '',
//                     keywords: '',
//                     project_image: null
//                 });
//             })
//             .catch((error) => console.error('Error creating project:', error));
//     };

//     return (
//         <div className='container'>
//             <h2>Create a New Project</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     placeholder="Project Title"
//                     value={formData.project_title}
//                     onChange={(event) => setFormData({ ...formData, project_title: event.target.value })}
//                     required
//                 />
//                 <textarea
//                     placeholder="Project Description"
//                     value={formData.description}
//                     onChange={(event) => setFormData({ ...formData, description: event.target.value })}
//                     required
//                 ></textarea>
//                 <input
//                     type="text"
//                     placeholder="Keywords (optional)"
//                     value={formData.keywords}
//                     onChange={(event) => setFormData({ ...formData, keywords: event.target.value })}
//                 />
//                 <input type="file" onChange={handleImageChange} />
//                 <button type="submit">Create Project</button>
//             </form>
//         </div>
//     );
// }

// export default CreateProject;