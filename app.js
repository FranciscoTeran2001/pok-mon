document.getElementById('search-button').addEventListener('click', () => {
    const weight = document.getElementById('weight_pokemon').value.trim();
    const name = document.getElementById('name_pokemon').value.trim();
    const height = document.getElementById('height_pokemon').value.trim();
    const type = document.getElementById('type').value;

    // Verificar si al menos uno de los campos tiene valor
    if (weight === '' && name === '' && height === '' && type === "seleccionar") {
        alert('Por favor, ingresa al menos un criterio de búsqueda.');
        return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`) // Obtener una lista grande de Pokémon
        .then(response => response.json())
        .then(data => {
            const pokemonList = data.results;
            const fetches = pokemonList.map(pokemon => fetch(pokemon.url).then(response => response.json()));
            return Promise.all(fetches);
        })
        .then(pokemonData => {
            let filteredPokemon = pokemonData;
            if (weight !== '' && weight !== "Buscar pokemon por peso") {
                filteredPokemon = filteredPokemon.filter(pokemon => pokemon.weight === parseInt(weight));
                const resultados = document.getElementById('resultados');
                resultados.innerHTML = `
                    <h1>Los resultados del peso ${weight} son:</h1>
                `;
            }

            if (name !== '' && name !== "Buscar pokemon") {
                filteredPokemon = filteredPokemon.filter(pokemon => pokemon.name=== name);
                const resultados = document.getElementById('resultados');
                resultados.innerHTML = `
                    <h1>Encontrado el pokemon ${name} :</h1>
                    
                `;
            }

            if (height !== '' && height !== "Buscar pokemon por altura") {
                filteredPokemon = filteredPokemon.filter(pokemon => pokemon.height === parseInt(height));
                const resultados = document.getElementById('resultados');
                resultados.innerHTML = `
                    <h1>Los resultados con la altura ${height} son:</h1>  
                `;
            }

            if (type !== "seleccionar") {
               
                filteredPokemon = filteredPokemon.filter(pokemon => pokemon.types.some(p => p.type.name === type));
                const resultados = document.getElementById('resultados');
                resultados.innerHTML = `
                    <h1>Los resultados con el tipo ${type} son:</h1>  
                `;
            }
            if(type === "all")
            {
                filteredPokemon = pokemonData;
                const resultados = document.getElementById('resultados');
                resultados.innerHTML = `
                    <h1>Los resultados son:</h1>  
                `;
            }
         
    



            const pokemonContainer = document.getElementById('pokemon');
            pokemonContainer.innerHTML = ''; // Limpiar resultados previos
            document.getElementById('weight_pokemon').value = ''; 
            document.getElementById('height_pokemon').value = '';
            document.getElementById('name_pokemon').value = '';
            document.getElementById('type').value = 'seleccionar';
            if (filteredPokemon.length > 0) {
                let resultsPerPage = 8;
                if (type === "all") {
                    resultsPerPage = 40;
                }
                
                // Define la cantidad de resultados por página
                const numPages = Math.ceil(filteredPokemon.length / resultsPerPage);
                const currentPage = 1; // Página actual (inicialmente la primera)
                const paginationButtonsContainer = document.getElementById('pagination-buttons');

                // Función para mostrar los resultados de la página actual
                function displayResults(page) {
                    pokemonContainer.innerHTML = ''; // Limpiar resultados previos
                    const startIndex = (page - 1) * resultsPerPage;
                    const endIndex = startIndex + resultsPerPage;
                    const currentResults = filteredPokemon.slice(startIndex, endIndex);
                
                    const gridContainer = document.createElement('div');
                    gridContainer.classList.add('grid-container');
                
                    currentResults.forEach(pokemon => {
                        const gridItem = document.createElement('div');
                        gridItem.classList.add('grid-item');
                
                        gridItem.innerHTML = `
                            <h2>${pokemon.name}</h2>
                            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                            <p>Altura: ${pokemon.height}</p>
                            <p>Peso: ${pokemon.weight}</p>
                        `;
                        gridContainer.appendChild(gridItem);
                    });
                
                    pokemonContainer.appendChild(gridContainer);
                }

                // Función para generar los botones de paginación
                function generatePaginationButtons() {
                    paginationButtonsContainer.innerHTML = ''; // Limpiar botones de paginación previos
                    for (let i = 1; i <= numPages; i++) {
                        const button = document.createElement('button');
                        button.textContent = i;
                        button.addEventListener('click', () => {
                            displayResults(i);
                        });
                        paginationButtonsContainer.appendChild(button);
                    }
                }

                displayResults(currentPage); // Mostrar resultados de la página actual
                generatePaginationButtons(); // Generar botones de paginación
            } else {
                pokemonContainer.innerHTML = '<p>No se encontraron Pokémon con esos criterios de búsqueda.</p>';
                document.getElementById('pagination-buttons').innerHTML = ''; // Limpiar botones de paginación
            }
        })
        .catch(error => {
            console.error(error);
        });
});



