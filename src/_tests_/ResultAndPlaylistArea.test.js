import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultAndPlaylistArea from "../ResultAndPlaylistArea";
import "@testing-library/jest-dom/extend-expect";

test("renders ResultAndPlaylistArea component", () => {
    render(
        <ResultAndPlaylistArea
            searchResults={[]}
            setSearchResults={() => {}}
            loading={false}
            accessToken="test_token"
        />
    );
    const playlistInput = screen.getByPlaceholderText("Playlist Name");
    expect(playlistInput).toBeInTheDocument();
});

test("handles adding and removing songs from playlist", () => {
    const searchResults = [
        { id: "1", name: "Test Song 1", artist: "Artist 1", album: "Album 1" },
        { id: "2", name: "Test Song 2", artist: "Artist 2", album: "Album 2" },
    ];
    render(
        <ResultAndPlaylistArea
            searchResults={searchResults}
            setSearchResults={() => {}}
            loading={false}
            accessToken="test_token"
        />
    );

    const addButton = screen.getAllByText("+")[0];
    fireEvent.click(addButton);

    const removeButton = screen.getAllByText("-")[0];
    fireEvent.click(removeButton);

    const song1 = screen.getByText("Test Song 1");
    expect(song1).toBeInTheDocument();
});
