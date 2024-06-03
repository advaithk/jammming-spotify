import React, { useState } from 'react';
import './SearchApp.css';

const sampleSearchResults = [
    {id: 1, name: 'New Shoes', artist: 'Paolo Nutini', album: 'These Streets'},
    {id: 2, name: 'Gold on the Ceiling', artist: 'Black Keys', album: 'El Camino'},
    {id: 3, name: 'Flashed Junk Mind', artist: 'Milky Chance', album: 'Sadnecessary'},
    {id: 4, name: 'My Type', artist: 'Saint Motel', album: 'My Type'},
    {id: 5, name: 'Illusion', artist: 'Dua Lipa', album: 'Illusion'},
    {id: 6, name: 'Lenely Nights', artist: 'LEISURE', album: 'Sunsetter'},
    {id: 7, name: 'The Sun', artist: 'Myd', album: 'Born a Loser'},
    {id: 8, name: 'Good Morning', artist: 'Kanye West', album: 'Graduation'},
]

const SearchApp = () => {

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to call Spotify APIs and get search results
    const searchSpotify = async () => {
        try {
            setLoading(true);

            setSearchResults([...sampleSearchResults]);
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
                setSearchResults={setSearchResults}
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

const ResultAndPlaylistArea = ({searchResults, setSearchResults, loading}) => {

    const [playlist, setPlaylist] = useState([]);

    const handleAdd = (songData) => {
        setPlaylist([...playlist, songData]);
        setSearchResults(searchResults.filter((song) => song.id !== songData.id));
    }

    const handleRemove = (songData) => {
        setPlaylist(playlist.filter((song) => song.id !== songData.id));
        setSearchResults([songData, ...searchResults]);
    }

    return (
        <div className={"result_playlist_area"}>
            <SearchResultsArea 
                searchResults={searchResults}
                loading={loading}
                handleAdd={handleAdd}
            />
            <PlaylistArea 
                playlist={playlist}
                handleRemove={handleRemove}
            />
        </div>
    )
}

const SearchResultsArea = ({searchResults, loading, handleAdd}) => {
    return (
        <div className={"search_results"}>
            <h2>Search Results</h2>
            <hr />
            {searchResults.map((songData) => <SongItem key={`searchresults_${songData.id}`} songData={songData} type="add" handleAdd={handleAdd} />)}
        </div>
    )
}

const PlaylistArea = ({playlist, handleRemove}) => {
    return (
        <div className={"playlist_area"}>
            {playlist.map((songData) => <SongItem key={`playlist_${songData.id}`} songData={songData} type="remove" handleRemove={handleRemove} />)}
        </div>
    )
}

const SongItem = ({songData, type, handleAdd, handleRemove}) => {
    return (
        <div className={"song_container"}>
            <div className={"song_data"}>
                <h3>{songData.name}</h3>
                <hr />
                <div className={"song_artist"}>{songData.artist} | {songData.album}</div>
            </div>
            <button className={"song_button"} type="button" onClick={() => type === "add" ? handleAdd(songData) : handleRemove(songData)}>
                {type === "add" ? "+" : "-"}
            </button>
        </div>
    );
}

export default SearchApp;