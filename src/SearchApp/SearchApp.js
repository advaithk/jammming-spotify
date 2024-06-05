import React, { useState, useEffect } from 'react';
import './SearchApp.css';

const CLIENT_ID = '624be565b6964802ad1354c478898c64';
const CLIENT_SECRET = 'bf2799a091514410a5de7ce04fdb5008';
const REDIRECT_URI = 'http://localhost:3000/'; // This should be the URL of your application where Spotify will redirect after authorization
const SCOPES = 'playlist-modify-public playlist-modify-private'; // The scopes you need

const SearchApp = () => {

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
            fetchAccessToken(code);
        } else if (!accessToken) {
            getSpotifyAuthorizeURL();
        }
    }, [accessToken]);

    const fetchAccessToken = async (code) => {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET) // Base64 encode client_id:client_secret
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            })
        });
        if (!response.ok) {
            console.error('Failed to fetch access token');
            return;
        }
        const data = await response.json();
        setAccessToken(data.access_token);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_expiration', Date.now() + data.expires_in * 1000);
    };

    const getSpotifyAuthorizeURL = () => {
        const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = url;
    };

    const searchSpotify = async () => {
        if (!accessToken) {
            console.error('No access token available');
            getSpotifyAuthorizeURL();
        }
        try {
            setLoading(true);
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${accessToken}`);
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
                accessToken={accessToken}
            />
        </div>
    );
};

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

const ResultAndPlaylistArea = ({searchResults, setSearchResults, loading, accessToken}) => {

    const [playlistName, setPlaylistName] = useState('');
    const [playlist, setPlaylist] = useState([]);

    // Create Playlist 
    const createPlaylist = async () => {
        if (isValidate()) {
            const userId = '7xfexuopxlybjdhrkakvpgj02';
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: playlistName,
                    description: 'New playlist from Jammming',
                    public: false
                })
            });
            if (!response.ok) {
                console.error('Failed to create playlist');
                return;
            }
            const data = await response.json();
            return data.id;
        }
    };

    // Add tracks to above created playlist
    const addTracksToPlaylist = async (playlistId, trackUris) => {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uris: trackUris })
        });

        if (!response.ok) {
            console.error('Failed to add tracks to playlist');
            return;
        }

        const data = await response.json();
        return data;
    };

    // Save playlist to Spotify
    const savePlaylistToSpotify = async () => {
        if (isValidate()) {
            const playlistId = await createPlaylist();
            const trackUris = playlist.map((song) => `spotify:track:${song.id}`);
            await addTracksToPlaylist(playlistId, trackUris);
            alert('Playlist saved to Spotify successfully!');
            setPlaylistName('');
            setPlaylist([]);
        }
    };

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