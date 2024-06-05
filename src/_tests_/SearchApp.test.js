import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchApp from "../SearchApp/SearchApp";
import "@testing-library/jest-dom/extend-expect";

// Mock the fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tracks: { items: [] } }),
    })
);

test("renders SearchApp component", () => {
    render(<SearchApp />);
    const searchInput = screen.getByPlaceholderText("Search for any song");
    expect(searchInput).toBeInTheDocument();
});

test("calls Spotify API on search", async () => {
    render(<SearchApp />);
    const searchInput = screen.getByPlaceholderText("Search for any song");
    const searchButton = screen.getByText("Search on Spotify");

    fireEvent.change(searchInput, { target: { value: "test song" } });
    fireEvent.click(searchButton);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("https://api.spotify.com/v1/search"),
        expect.any(Object)
    );
});

test("displays search results", async () => {
    // Mock search results
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    tracks: {
                        items: [
                            {
                                id: "1",
                                name: "Test Song 1",
                                artists: [{ name: "Artist 1" }],
                                album: { name: "Album 1" },
                            },
                            {
                                id: "2",
                                name: "Test Song 2",
                                artists: [{ name: "Artist 2" }],
                                album: { name: "Album 2" },
                            },
                        ],
                    },
                }),
        })
    );

    render(<SearchApp />);
    const searchInput = screen.getByPlaceholderText("Search for any song");
    const searchButton = screen.getByText("Search on Spotify");

    fireEvent.change(searchInput, { target: { value: "test song" } });
    fireEvent.click(searchButton);

    const song1 = await screen.findByText("Test Song 1");
    const song2 = await screen.findByText("Test Song 2");

    expect(song1).toBeInTheDocument();
    expect(song2).toBeInTheDocument();
});
