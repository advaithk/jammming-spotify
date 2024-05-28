import React, { useState } from 'react';
import './SearchApp.css';

const SearchApp = () => {

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to call Spotify APIs and get search results
    const searchSpotify = async () => {
        try {
            setLoading(true);

            setSearchResults([]);
        } catch (error) {
            console.error('Error fetching search results: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <SearchArea 
                searchText={searchText}
                setSearchText={setSearchText}
                handleSearch={searchSpotify}
            />
            <SearchResults 
                searchResults={searchResults}
                loading={loading}
            />
        </div>
    );
}

const SearchArea = ({searchText, setSearchText, handleSearch}) => {
    return (
        <div className={"search_area"}>
            <input 
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={(e) => {setSearchText((e.target.value))}}
            />
            <button type="button" onClick={handleSearch}>Search</button>
        </div>
    );
}

const SearchResults = ({searchResults, loading}) => {
    return (
        <div className={"search_results"}>
            
        </div>
    )
}



export default SearchApp;