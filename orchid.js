const API_KEY = '2e8bcef36fcdde3283a36fe890437fb6';
  
const BASE_URL = 'https://rebrickable.com/api/v3';

const cardColors = ['blue-card', 'yellow-card', 'red-card', 'black-card'];


function getSetNumberFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const setNum = urlParams.get('set');
    return setNum ; 
}

const SET_NUM = getSetNumberFromURL();

async function loadSetInfo() {
    try {
        const response = await fetch(`${BASE_URL}/lego/sets/${SET_NUM}/`, {
            headers: {
                'Authorization': `key ${API_KEY}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch set: ${response.status}`);
        }
        
        const data = await response.json();
        

        document.title = `LEGO ${data.name}`;
        
    
        const setNameHeading = document.getElementById('set-2');
        if (setNameHeading) {
            setNameHeading.textContent = data.name;
        }
        
     
        const setImage = document.querySelector('#intro .ight img');
        if (setImage) {
            setImage.src = data.set_img_url;
            setImage.alt = data.name;
        }
        
       
        const introDiv = document.getElementById('intro');
        if (introDiv) {
            if (!document.getElementById('set-2')) {
                const yearElement = document.createElement('h2');
                setNameHeading.id = 'set-2';
                setNameHeading.textContent = ` ${data.name}`;
                introDiv.appendChild(setNameHeading);
            } else {
                document.getElementById('set-2').textContent = ` ${data.name}`;
            }
            if (!document.getElementById('set-year')) {
                const yearElement = document.createElement('h2');
                yearElement.id = 'set-year';
                yearElement.textContent = `Year: ${data.year}`;
                introDiv.appendChild(yearElement);
            } else {
                document.getElementById('set-year').textContent = `Year: ${data.year}`;
            }
            
            if (!document.getElementById('set-parts')) {
                const partsElement = document.createElement('h2');
                partsElement.id = 'set-parts';
                partsElement.textContent = `Number of Parts: ${data.num_parts}`;
                introDiv.appendChild(partsElement);
            } else {
                document.getElementById('set-parts').textContent = `Number of Parts: ${data.num_parts}`;
            }
        }
        
   
        fetchAllParts();
    } catch (error) {
        console.error('Error loading set info:', error);
        const introDiv = document.getElementById('intro');
        if (introDiv) {
            introDiv.innerHTML = '<div class="error">Error loading set information</div>';
        }
    }
}


async function fetchAllParts() {
    try {
        let allParts = [];
        let nextUrl = `${BASE_URL}/lego/sets/${SET_NUM}/parts/`;
        
    
        while (nextUrl) {
            const response = await fetch(nextUrl, {
                headers: {
                    'Authorization': `key ${API_KEY}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch parts: ${response.status}`);
            }
            
            const data = await response.json();
            allParts = [...allParts, ...data.results];
            
            
            nextUrl = data.next;
        }
        
        displayParts(allParts);
    } catch (error) {
        console.error('Error fetching parts:', error);
        document.getElementById('parts-grid').innerHTML = '<div class="loading">Error loading parts. Please try again later.</div>';
    }
}

// Display parts
function displayParts(parts) {
    const partsGrid = document.getElementById('parts-grid');
    partsGrid.innerHTML = '';
    
 
    const partsToDisplay = parts.slice(0, 100);
    
    partsToDisplay.forEach((part, index) => {
       
        const colorClass = cardColors[index % cardColors.length];
        
        const partCard = document.createElement('div');
        partCard.className = `part-card ${colorClass}`;
        
        partCard.innerHTML = `
            <div class="part-image-container">
                <img src="${part.part.part_img_url}" alt="${part.part.name}" class="part-image"
                     onerror="this.src='https://www.rebrickable.com/static/img/parts/noimg.png'">
            </div>
            <div class="part-info">
                <div class="part-name">${part.part.name}</div>
                <div>Color: ${part.color.name}</div>
                <div>Quantity: ${part.quantity}</div>
            </div>
        `;
        
        partsGrid.appendChild(partCard);
    });
}

// Start when page loads
window.onload = loadSetInfo;
