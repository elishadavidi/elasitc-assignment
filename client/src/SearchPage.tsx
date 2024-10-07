import React, {useState} from 'react';
import axios from 'axios';
import {SEARCH_TYPES} from "./models/searchTypes";

const SearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState(SEARCH_TYPES.FREE);
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://localhost:5000/search', {
                query,
                searchType
            });
            setResults(response.data.results);
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

            <button onClick={handleSearch}>!חפש</button>

            <div>
                {results.length > 0 ? (
                    <div>
                        <p>!נמצאו {results.length} תוצאות </p>
                        <table>
                            <thead>
                            <tr>
                                <th>פעולות</th>
                                {Object.keys(results[0]).map((field, index) => (
                                    field !== 'id' && field !== 'deleted' && index < 6 ? (
                                        <th key={index}>{field}</th>
                                    ) : null
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
                                    {Object.keys(result).map((field, index) => (
                                        field !== 'id' && field !== 'deleted' && index < 6 ? (
                                            <td key={index}>{result[field]}</td>
                                        ) : null
                                    ))}
                                    <td>{result.id}</td>
                                </tr>
                            ))}
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
