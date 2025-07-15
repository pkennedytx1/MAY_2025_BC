// Function to demonstrate fetch request steps
async function fetchBreweriesByCity() {
    console.log('🚀 Starting fetch request...');
    const city = document.getElementById('city-input').value
    
    // Step 1: Define the URL and parameters
    const baseUrl = 'https://api.openbrewerydb.org/v1/breweries';
    const params = new URLSearchParams({ by_city: city });
    const fullUrl = `${baseUrl}?${params}`;
    
    console.log('📍 Step 1: URL Construction');
    console.log('   Base URL:', baseUrl);
    console.log('   Parameters:', { by_city: city });
    console.log('   Full URL:', fullUrl);
    
    try {
        // Step 2: Make the fetch request
        console.log('📡 Step 2: Making fetch request...');
        // Client -> server -> client
        const response = await fetch(fullUrl);
        
        console.log('📊 Step 3: Response received');
        console.log('   Status:', response.status);
        console.log('   Status Text:', response.statusText);
        console.log('   Headers:', Object.fromEntries(response.headers.entries()));
        
        // Step 4: Check if request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Step 5: Parse the JSON response
        console.log('🔄 Step 4: Parsing JSON response...');
        // deserialization into usable json
        const data = await response.json();
        
        console.log('✅ Step 5: Data successfully parsed');
        console.log('   Number of breweries found:', data.length);
        console.log('   First brewery:', data[0]);
        console.log('   All breweries:', data);
        
        return data;
        
    } catch (error) {
        console.error('❌ Error during fetch:', error);
        throw error;
    }
}

// Function to handle button click
function handleFetchButtonClick() {
    console.log('🔘 Button clicked! Starting brewery fetch...');
    fetchBreweriesByCity()
        .then(data => {
            console.log('🎉 Fetch completed successfully!');
        })
        .catch(error => {
            console.error('💥 Fetch failed:', error);
        });
}

// Recursive function example: Calculate factorial
function factorial(n) {
    console.log(`🔍 Calculating factorial(${n})...`);
    
    // Base case: factorial of 0 or 1 is 1
    if (n === 0 || n === 1) {
        console.log(`✅ Base case reached! factorial(${n}) = 1`);
        return 1;
    }
    
    // Recursive case: n! = n × (n-1)!
    console.log(`🔄 Recursive case: ${n}! = ${n} × (${n-1})!`);
    const result = n * factorial(n - 1);
    console.log(`📊 factorial(${n}) = ${n} × ${result/n} = ${result}`);
    return result;
}

// Function to handle recursive button click
function handleRecursiveButtonClick() {
    console.log('🔘 Recursive button clicked!');
    
    const input = document.getElementById('factorialInput');
    const number = parseInt(input.value);
    
    if (isNaN(number) || number < 0) {
        console.log('❌ Please enter a valid non-negative number!');
        alert('Please enter a valid non-negative number!');
        return;
    }
    
    console.log(`🚀 Starting factorial calculation for ${number}...`);
    console.log('📝 Recursive process:');
    
    const result = factorial(number);
    
    console.log(`🎉 Final result: ${number}! = ${result}`);
    
    // Display result in the UI
    const resultElement = document.getElementById('factorialResult');
    resultElement.textContent = `${number}! = ${result}`;
    resultElement.style.display = 'block';
}
