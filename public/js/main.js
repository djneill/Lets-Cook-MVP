console.log("JavaScript file connected successfully!");

const searchInput = document.querySelector('input[name="search"]');
const searchResultsContainer = document.querySelector('#search-results');

searchInput.addEventListener('change', async () => {
    const searchQuery = searchInput.value;

    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ search: searchQuery }),
        });

        if (response.ok) {
            const searchResults = await response.json();

            // Handle the search results
            console.log(searchResults);
            displaySearchResults(searchResults);
        } else {
            console.error('Search request failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during search request:', error);
    }
});

function displaySearchResults(searchResults) {
    // Access the combined search results and update the UI as desired
    console.log(searchResults);
    // ...
}
