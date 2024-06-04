import React, { useState } from 'react';
import './SearchApp.css';

const SearchApp = () => {

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    /* Spotify API Integration */
        let spotifyToken = null;
        let tokenExpirationTime = null;

        // Search Spotify API - To search for inputted text
        const searchSpotify = async () => {
            try {
                setLoading(true);
                const token = await authorizeSpotify();
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${token}`);
                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow"
                };
                const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=track&limit=10`, requestOptions);
                if (!response.ok) {
                    console.error('HTTP error: ', response.status);
                    const errorText = await response.text();
                    console.error('Error response: ', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const tracks = data.tracks.items.map((track) => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                    };
                });
                setSearchResults([...tracks]);
            } catch (error) {
                console.error('Error fetching search results: ', error);
            } finally {
                setLoading(false);
            }
        };

        // Get Access token if previous one is expired
        const authorizeSpotify = async () => {
            const currentTime = Date.now();
            if (spotifyToken && tokenExpirationTime && currentTime < tokenExpirationTime) {
                return spotifyToken;
            }
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            const urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "client_credentials");
            urlencoded.append("client_id", "624be565b6964802ad1354c478898c64");
            urlencoded.append("client_secret", "bf2799a091514410a5de7ce04fdb5008");
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
            };
            const response = await fetch("https://accounts.spotify.com/api/token", requestOptions);
            if (!response.ok) {
                console.error('HTTP error: ', response.status);
                const errorText = await response.text();
                console.error('Error response: ', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            spotifyToken = data.access_token;
            tokenExpirationTime = currentTime + (data.expires_in * 1000);
            return spotifyToken;
        };
    /* Spotify API Integration */


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
                onKeyDown={(e) => {
                    if(e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <button type="button" onClick={handleSearch}>
                Search on <b>Spotify</b>
            </button>
        </div>
    );
}

const ResultAndPlaylistArea = ({searchResults, setSearchResults, loading}) => {

    const [playlistName, setPlaylistName] = useState('');
    const [playlist, setPlaylist] = useState([]);

    // Save playlist to Spotify
    const savePlaylistToSpotify = async () => {
        if(isValidate()) {

        }
    }

    // To validate submit values
    const isValidate = () => {
        let isValid = true;
        if (playlistName.trim() === '') {
            alert('Please enter a playlist name');
            isValid = false;
        }
        if (playlist.length === 0) {
            alert('Please add at least one song to the playlist');
            isValid = false;
        }
        return isValid;
    }

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
                playlistName={playlistName}
                setPlaylistName={setPlaylistName}
                savePlaylistToSpotify={savePlaylistToSpotify}
            />
        </div>
    )
}

const SearchResultsArea = ({searchResults, loading, handleAdd}) => {
    return (
        <div className="search_results">
            <h2>Search Results</h2>
            <hr />
            {loading ? 
                (<Loading />)
                : 
                (searchResults.map((songData) => (
                    <SongItem
                        key={`searchresults_${songData.id}`}
                        songData={songData}
                        type="add"
                        handleAdd={handleAdd}
                    />
                )))
            }
        </div>
    );
}

const Loading = () => {
    return <div className="loading-spinner"></div>;
};

const PlaylistArea = ({playlist, handleRemove, playlistName, setPlaylistName, savePlaylistToSpotify}) => {
    return (
        <div className={"playlist_area"}>
            <input 
                type="text"
                placeholder="Playlist Name" 
                value={playlistName} 
                onChange={(e) => setPlaylistName(e.target.value)}>
            </input>
            <hr />
            <div className={"playlist_tracks"}>
                {playlist?.map((songData) => <SongItem key={`playlist_${songData.id}`} songData={songData} type="remove" handleRemove={handleRemove} />)}
            </div>
            <button className={"save_button"} type="button" onClick={() => {savePlaylistToSpotify()}}>
                Save to Spotify
            </button>
        </div>
    )
}

const SongItem = ({songData, type, handleAdd, handleRemove}) => {
    return (
        <div className={"song_container"}>
            <div className={"song_data"}>
                <h3>{songData.name}</h3>
                <hr />
                <div className={"song_details"}>Artist: <span>{songData.artist}</span></div>
                <div className={"song_details"}>Album: <span>{songData.album}</span></div>
            </div>
            <button 
                className={(type === "add" ? "add_button" : "remove_button") + " song_button"} 
                type="button" onClick={() => type === "add" ? handleAdd(songData) : handleRemove(songData)}
            >
                {type === "add" ? "+" : "-"}
            </button>
        </div>
    );
}

export default SearchApp;