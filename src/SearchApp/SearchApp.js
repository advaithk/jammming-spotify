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

            // const token = await authorizeSpotify();

            const myHeaders = new Headers();
            myHeaders.append("Authorization", "BQD4pbPWyKZ3isspbgsKMVxQLfFatb_sAlTgW7O21yRCZbbHPxj9csSqygpU3mODV98zidpT1fqCaMGA2t9_P5zsla6QTfmkaeESjbRsSzEu1znagFE");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            const response = await fetch(`https://api.spotify.com/v1/search?q=${searchText}&type=track&limit=10`, requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
            
            const data = await response.json();
            const tracks = data.tracks.items.map((track) => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                };
            })
            setSearchResults([...tracks]);
        } catch (error) {
            console.error('Error fetching search results: ', error);
        } finally {
            setLoading(false);
        }
    };

    const authorizeSpotify = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Cookie", "__Host-device_id=AQCKwWTKDJHdvYP69rdFkA-7E8OlDi234x7ZZs8wfyuOBRY5EK9qVUOwfHs-VC6RzKhzXSLFSTGy8duzfQUdZSZievCjornL7-g; sp_tr=false");

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

        const token = await fetch("https://accounts.spotify.com/api/token", requestOptions)
            .then((response) => {return response.text()})
            .then((result) => console.log(result))
            .catch((error) => console.error(error));

        return token;
    }

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