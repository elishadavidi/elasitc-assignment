import React, {useState} from 'react';
import axios from 'axios';
import {SEARCH_TYPES} from "./models/searchTypes";

const SearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState(SEARCH_TYPES.FREE);
    const [results, setResults] = useState<any[]>([]);
    const [neighborhoodFilters, setNeighborhoodFilters] = useState<any[]>([]);
    const [typeFilters, setTypeFilters] = useState<any[]>([]);
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const displayFields = ['סוג','קבוצה','שם ראשי','שם מישני','שכונה'];

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://localhost:5000/search', {
                query,
                searchType,
                filters: {
                    neighborhoods: selectedNeighborhoods,
                    types: selectedTypes
                }
            });
            setResults(response.data.results);
            setNeighborhoodFilters(response.data.filters.neighborhoods);
            setTypeFilters(response.data.filters.types);
        } catch (error) {
            console.error('Search failed', error);
        }
    };


    const handleDelete = async (id: string) => {
        try {
            await axios.post('http://localhost:5000/delete', {id});
            setResults(results.filter(result => result.id !== id));
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const handleFilterChange = (filterType: 'neighborhood' | 'type', value: string) => {
        if (filterType === 'neighborhood') {
            setSelectedNeighborhoods((prev) =>
                prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
            );
        } else if (filterType === 'type') {
            setSelectedTypes((prev) =>
                prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
            );
        }
    };

    return (
        <div>
            <h1>חיפוש</h1>
            <input
                className='search-input'
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />

            <div className='radio-buttons'>
                <label>
                    <input
                        type="radio"
                        value="free"
                        checked={searchType === SEARCH_TYPES.FREE}
                        onChange={e => setSearchType(SEARCH_TYPES.FREE)}
                    /> חיפוש חופשי
                </label>
                <label>
                    <input
                        type="radio"
                        value="exact"
                        checked={searchType === SEARCH_TYPES.EXACT}
                        onChange={e => setSearchType(SEARCH_TYPES.EXACT)}
                    /> חיפוש ביטוי מדויק
                </label>
                <label>
                    <input
                        type="radio"
                        value="phrase"
                        checked={searchType === SEARCH_TYPES.PHRASE}
                        onChange={e => setSearchType(SEARCH_TYPES.PHRASE)}
                    /> חיפוש ביטוי שלם
                </label>
            </div>

            <div className="filters">
                <div style={{direction: "rtl"}}>
                    <h3>סוג</h3>
                    {typeFilters.map((type) => (
                        <label key={type.street}>
                            <input
                                type="checkbox"
                                value={type.street}
                                checked={selectedTypes.includes(type.street)}
                                onChange={() => handleFilterChange('type', type.street)}
                            />
                            {type.street} ({type.count})
                            <br/>
                        </label>
                    ))}
                </div>
                <div style={{direction: "rtl"}}>
                    <h3>שכונה</h3>
                    {neighborhoodFilters.map((neighborhood) => (
                        <label key={neighborhood.city}>
                            <input
                                type="checkbox"
                                value={neighborhood.city}
                                checked={selectedNeighborhoods.includes(neighborhood.city)}
                                onChange={() => handleFilterChange('neighborhood', neighborhood.city)}
                            />
                            {neighborhood.city} ({neighborhood.count})
                            <br/>
                        </label>
                    ))}
                </div>
            </div>

            <button onClick={handleSearch}>!חפש</button>

            <div>
                {results.length > 0 ? (
                    <div>
                        <p>!נמצאו {results.length} תוצאות </p>
                        <table>
                            <thead>
                            <tr>
                                <th>פעולות</th>
                                {displayFields.map((name) => (
                                    <th key={name}>{name}</th>
                                ))}
                                <th>ID</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.map((result) => (
                                    <tr key={result.id}>
                                        <td>
                                            <button onClick={() => handleDelete(result.id)}>מחק</button>
                                        </td>
                                        {displayFields.map((name) => (
                                                <td key={name}>{result[name]}</td>
                                        ))}
                                        <td>{result.id}</td>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>לא נמצאו תוצאות</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
