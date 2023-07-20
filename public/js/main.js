document.addEventListener('DOMContentLoaded', () => {
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

            console.log(response);

            if (!response.ok) {
                throw new Error(`Search request failed with status: ${response.status} - ${response.statusText}`);
            }

            const searchResults = await response.json();

            // Handle the search results
            displaySearchResults(searchResults);
        } catch (error) {
            console.error('Error during search request:', error);
        }
    });

    function displaySearchResults(searchResults) {
        // Access the MongoDB and API results and update the UI as desired
        const mongoResults = searchResults.mongoResults;
        const apiResults = searchResults.apiResults;

        // Clear the previous results
        searchResultsContainer.innerHTML = '';

        // Display MongoDB Results
        for (const mongoResult of mongoResults) {
            const cardElement = createCardElement(mongoResult.title, mongoResult.image, mongoResult._id);
            searchResultsContainer.appendChild(cardElement);
        }

        // Display Spoonacular API Results
        for (const apiResult of apiResults) {
            const cardElement = createCardElement(apiResult.title, apiResult.image, apiResult.id);
            searchResultsContainer.appendChild(cardElement);
        }
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