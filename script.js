const API_KEY = '2e8bcef36fcdde3283a36fe890437fb6';
        
        // Base URL for the API
        const BASE_URL = 'https://rebrickable.com/api/v3';
        
        // LEGO Botanical Collection set numbers
        const BOTANICAL_SETS = [
            '10280-1',  // Flower Bouquet
            '10309-1',  // Succulents
            '10311-1',  // Orchid
            '10289-1',  // Bird of Paradise
            '10281-1',  // Bonsai Tree
            '10329-1',  // Tiny Plants
            '10313-1',  // Wildflower Bouquet
            '10328-1',  // Dried Flower Centerpiece
            '40524-1'   // Sunflowers
        ];
        
        // Fetching sets
        async function fetchBotanicalSets() {
            const setsContainer = document.getElementById('sets-container');
            setsContainer.innerHTML = ''; 
            
            try {
               
                for (const setNum of BOTANICAL_SETS) {
                    try {
                        const response = await fetch(`${BASE_URL}/lego/sets/${setNum}/`, {
                            headers: {
                                'Authorization': `key ${API_KEY}`,
                                'Accept': 'application/json'
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error(`Failed to fetch set ${setNum}: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        
                        const setCard = document.createElement('div');
                        setCard.className = 'set-card';
                        setCard.innerHTML = `
                            <img src="${data.set_img_url}" alt="${data.name}" class="set-image">
                            <p class="set-name">${data.name}</p>
                        `;
                        
                        
                        setCard.addEventListener('click', () => {
                           
                            window.location.href = `set-details.html?set=${setNum}`;
                        });
                        
                        setsContainer.appendChild(setCard);
                    } catch (error) {
                        console.error(`Error fetching set ${setNum}:`, error);
                        // Create error card
                        const errorCard = document.createElement('div');
                        errorCard.className = 'set-card';
                        errorCard.innerHTML = `
                            <p>Set ${setNum} could not be loaded</p>
                        `;
                        setsContainer.appendChild(errorCard);
                    }
                }
            } catch (error) {
                console.error('Error fetching botanical sets:', error);
                setsContainer.innerHTML = '<div class="loading">Error loading sets. Please try again later.</div>';
            }
        }
        
        // Start when page loads
        window.onload = fetchBotanicalSets;



//orchid script
