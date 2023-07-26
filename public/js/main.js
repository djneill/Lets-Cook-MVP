document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('input[name="search"]');
    const searchIcon = document.getElementById('search-icon');
    const searchResultsContainer = document.querySelector('#search-results');

    const performSearch = async () => {
        const searchQuery = searchInput.value;

        try {
            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ search: searchQuery }),
            });

            if (!response.ok) {
                throw new Error(`Search request failed with status: ${response.status} - ${response.statusText}`);
            }

            const searchResults = await response.json();
            console.log(searchResults);

            // Handle the search results
            displaySearchResults(searchResults);
        } catch (error) {
            console.error('Error during search request:', error);
        }
    };

    searchInput.addEventListener('change', () => {
        performSearch();
    });

    searchIcon.addEventListener('click', () => {
        performSearch();
    });

    function displaySearchResults(searchResults) {
    
        // Check if searchResults is null or undefined
        if (!searchResults) {
            console.error('No search results found.');
            return;
        }
    
        // Access the MongoDB and API results and update the UI as desired
        const mongoResults = searchResults.mongoResults;
    
        // Check if mongoResults is an array
        if (!Array.isArray(mongoResults)) {
            console.error('MongoDB results are not in an array format:', mongoResults);
            return;
        }
    
        // Clear the previous results
        searchResultsContainer.innerHTML = '';
    
        // Check if there are no matching results
        if (mongoResults.length === 0) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.classList.add('text-center', 'text-gray-500', 'my-4');
            noResultsMessage.innerText = 'No matching results found.';
            searchResultsContainer.appendChild(noResultsMessage);
            return; // Exit the function early
        }
    
        // Display MongoDB Results
        for (const mongoResult of mongoResults) {
            const cardElement = createCardElement(mongoResult.title, mongoResult.image, mongoResult._id);
            const gridItem = document.createElement('div');
            // gridItem.classList.add('container') 
            // gridItem.classList.add('grid') 
            // gridItem.classList.add('gap-4') 
            // gridItem.classList.add('lg:grid-cols-2') 
            // gridItem.classList.add('md:grid-cols-1') 
            // gridItem.classList.add('sm:grid-flow-row') 
            // gridItem.classList.add('mx-auto') 
            // gridItem.classList.add('p-5') 
            gridItem.appendChild(cardElement);
            searchResultsContainer.appendChild(gridItem);
        }    

        // Display Spoonacular API Results
        // for (const apiResult of apiResults) {
        //     const cardElement = createCardElement(apiResult.title, apiResult.image, apiResult.id, false);
        //     searchResultsContainer.appendChild(cardElement);
        // }
    }

    function createCardElement(title, imageUrl, id) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.classList.add('bg-zinc-200');
        cardElement.classList.add('lg:w-96');
        cardElement.classList.add('sm:w-full');
        cardElement.classList.add('shadow-2xl');
        cardElement.classList.add('mx-auto');
        cardElement.classList.add('m-4');

        const figureElement = document.createElement('figure');
        figureElement.classList.add('px-4');
        figureElement.classList.add('py-4');
        figureElement.classList.add('mx-auto');

        const ulElement = document.createElement('ul');
        ulElement.classList.add('justify-content-between');
        ulElement.classList.add('mt-5');

        const liElement = document.createElement('li');
        liElement.classList.add('items-center');

        const aElement = document.createElement('a');
        aElement.setAttribute('href', `/post/${id}`);

        const h2Element = document.createElement('h2');
        h2Element.classList.add('card-title');
        h2Element.classList.add('justify-center');
        h2Element.classList.add('text-center');
        h2Element.classList.add('m-4');
        h2Element.innerText = title;

        const imgElement = document.createElement('img');
        imgElement.classList.add('rounded');
        imgElement.classList.add('max-h-48');
        imgElement.classList.add('mx-auto');
        imgElement.src = imageUrl;

        aElement.appendChild(h2Element);
        aElement.appendChild(imgElement);
        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);
        figureElement.appendChild(ulElement);
        cardElement.appendChild(figureElement);

        return cardElement;
    }
});