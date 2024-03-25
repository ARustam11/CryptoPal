async function fetchCryptoData() {
    // Fetch
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Ctether%2Csolana%2Cbinancecoin%2Cripple%2Ctoncoin%2Cusdc%2Ccardano%2Cdogecoin%2Clitecoin%2Cstellar&vs_currencies=usd&include_market_cap=true&include_24hr_change=true');
    const data = await response.json();
    const tbody = document.querySelector('#crypto-table tbody');

    // Clear existing table rows Just in case
    tbody.innerHTML = '';

    // Puting info into the table with fetched data
    for (const coinId in data) {
        const coinInfo = data[coinId];
        const price = coinInfo.usd;
        const change = coinInfo.usd_24h_change.toFixed(2);
        const marketCap = coinInfo.usd_market_cap;
        const row = document.createElement('tr');
        const finalCoin = coinId.charAt(0).toUpperCase() + coinId.slice(1);
        const changeClass = change >= 0 ? 'positive' : 'negative';

        row.innerHTML = `
            <td>${finalCoin}</td>
            <td>$${price}</td>
            <td class="${changeClass}">${change}%</td>
            <td>$${marketCap.toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    }
}


// Exchanger
// Fetching data from API
async function fetchExchangeData() {
    const exchangeResponse = await fetch ('https://api.coingecko.com/api/v3/exchange_rates');
    const exchangeData = await exchangeResponse.json();
    return exchangeData;
}

// Puting rates into dropdown options
async function populateDropdowns() {
    const exchangeData = await fetchExchangeData();
    const rates = exchangeData.rates;
    const fromCurrencyDropdown = document.getElementById('from-currency');
    const toCurrencyDropdown = document.getElementById('to-currency');

    for (const currencyCode in rates) {
        const option = document.createElement('option');
        option.text = `${currencyCode} - ${rates[currencyCode].name}`;
        option.value = currencyCode;
        fromCurrencyDropdown.add(option.cloneNode(true));
        toCurrencyDropdown.add(option);
    }
    toCurrencyDropdown.value = "usd";
}

// Convert currency
function convertCurrency() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const resultElement = document.getElementById('result');

    fetchExchangeData().then(exchangeData => {
        const rates = exchangeData.rates;
        const fromRate = rates[fromCurrency].value;
        const toRate = rates[toCurrency].value;
        const convertedAmount = amount * (toRate / fromRate);
        resultElement.textContent = `Converted amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
    });
}

// Event listener for convert button
document.getElementById('convert-button').addEventListener('click', convertCurrency);
populateDropdowns();
fetchCryptoData();


