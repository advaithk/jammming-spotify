import React, { useState } from 'react';
import './SearchApp.css';

const sampleSearchResults = [
    {id: 1, name: 'Song 1', artist: 'Artist 1', album: 'Album 1'},
    {id: 2, name: 'Song 2', artist: 'Artist 2', album: 'Album 2'},
    {id: 3, name: 'Song 3', artist: 'Artist 3', album: 'Album 3'},
    {id: 4, name: 'Song 4', artist: 'Artist 4', album: 'Album 4'},
    {id: 5, name: 'Song 5', artist: 'Artist 5', album: 'Album 5'},
    {id: 5, name: 'Song 6', artist: 'Artist 6', album: 'Album 6'},
    {id: 5, name: 'Song 7', artist: 'Artist 7', album: 'Album 7'},
    {id: 5, name: 'Song 8', artist: 'Artist 8', album: 'Album 8'},
]

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
            <ResultAndPlaylistArea 
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
                placeholder="Search for any song"
                value={searchText}
                onChange={(e) => {setSearchText((e.target.value))}}
            />
            <button type="button" onClick={handleSearch}>
                Search on <b>Spotify</b>
            </button>
        </div>
    );
}

const ResultAndPlaylistArea = ({searchResults, loading}) => {

    const [playlist, setPlaylist] = useState([]);

    return (
        <div className={"result_playlist_area"}>
            <SearchResultsArea 
                searchResults={searchResults}
                loading={loading}
                setPlaylist={setPlaylist}
            />
            <PlaylistArea 
                playlist={playlist}
                setPlaylist={setPlaylist}
            />
        </div>
    )
}

const SearchResultsArea = ({searchResults, setPlaylist, loading}) => {
    return (
        <div className={"search_results"}>
            <h2>Search Results</h2>
            <hr />
            {sampleSearchResults.map((songData) => <SongItem key={songData.id} songData={songData} type="add" />)}
        </div>
    )
}

const PlaylistArea = ({playlist}) => {
    return (
        <div className={"playlist_area"}>
            {sampleSearchResults.map((songData) => <SongItem key={songData.id} songData={songData} type="remove" />)}
        </div>
    )
}

const SongItem = ({songData, type}) => {
    return (
        <div className={"song_container"}>
            <div className={"song_data"}>
                <h3>{songData.name}</h3>
                <hr />
                <div className={"song_artist"}>{songData.artist} | {songData.album}</div>
            </div>
            <button className={"song_button"} type="button" onClick={() => {}}>
                {type === "add" ? "+" : "-"}
            </button>
        </div>
    );
}

export default SearchApp;