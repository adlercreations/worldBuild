import React, { useState, useEffect } from 'react';
import Card from './Card';

function PortfolioList() {
    const [portfolios, setPortfolios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5555/api/portfolios')
            .then(response => response.json())
            .then(data => setPortfolios(data))
            .catch(error => setError('Error fetching portfolios.'));
    }, []);

    if (error) return <div>{error}</div>;

    return (
        <div className="portfolio-list">
            {portfolios.map((portfolio) => (
                <Card 
                    key={portfolio.id} 
                    title={portfolio.artist_name} 
                    description={portfolio.bio} 
                    image={portfolio.profile_image} 
                    link={`/portfolios/${portfolio.id}`} 
                />
            ))}
        </div>
    );
}

export default PortfolioList;


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; 

// function PortfolioList() {
//     const [portfolios, setPortfolios] = useState([]);

//     useEffect(() => {
//     // Fetch the portfolios from the API
//         fetch('http://localhost:5555/api/portfolios')
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Http error! status: ${response.status}');
//                 }
//                 return response.json();
//             })
//             .then((data) => setPortfolios(data))
//             .catch((error) => console.error('Error fetching portfolios:', error));
//     }, []);

//     return (
//         <div className='container'>
//             <h2>Artist Portfolios</h2>
//             <div className='button-container'>
//                 <Link to="/create-portfolio">
//                     <button>Create New Portfolio</button>
//                 </Link>
//             </div>
//             <div className='portfolio-list'>
//                 {portfolios.map((portfolio) => (
//                     <div key={portfolio.id} className='portfolio-card'>
//                         {portfolio.profile_image && (
//                             <img src={portfolio.profile_image} alt={portfolio.artist_name} className='portfolio-image' />
//                         )}
//                         <h3>{portfolio.artist_name}</h3>
//                         <p>{portfolio.bio}</p>
//                         <Link to={`/portfolios/${portfolio.id}`}>
//                             <button>View Portfolio</button>
//                         </Link>
//                     </div>
//                 ))}
//             </div>

//         </div>
//     );
// }

// export default PortfolioList;