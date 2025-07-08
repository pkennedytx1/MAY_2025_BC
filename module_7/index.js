window.onload = () => getBreweries()

const displayBreweries = (breweries) => {
    const searchResultsContainer = document.getElementById("search-results")
    breweries.forEach((brewery) => {
        const breweryCard = document.createElement('div')
        breweryCard.innerHTML = `
            <div>
                <h1>${brewery.name}</h1>
                <h3>${brewery.address_1}, ${brewery.city}</h1>
            </div>`
        searchResultsContainer.append(breweryCard)
    })
}

const getBreweries = async () => {
    // Newer
    try {
        const response = await fetch('https://api.openbrewerydb.org/v1/breweries')
        const data = await response.json()
        displayBreweries(data.slice(0, 5))
    } catch (err) {
        console.error(err)
    }
    // Older async implementation
    // fetch('https://api.openbrewerydb.org/v1/breweries')
    //     .then(response => response.json())
    //     .then(data => {
    //         displayBreweries(data.slice(0, 5))
    //     })
    //     .catch(error => console.error("Error:", error));
}