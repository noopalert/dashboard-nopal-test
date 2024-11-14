async function fetchDataAndUpdateCard(cardId, titleText, dataKey) {
    const cardValue = document.getElementById(`card-value${cardId}`);
    const cardTitle = document.getElementById(`card-title${cardId}`);
    
    const response = await fetch('/datas/data_mart_transaction.json');
    const jsonData = await response.json();

    const sumData = {};
    
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
    
    jsonData.fact.forEach((transaction) => {
        const amount = transaction[dataKey];
        if (sumData[amount]) {
            sumData[amount] += amount;
        } else {
            sumData[amount] = amount;
        }
    });

    const dataValues = Object.values(sumData);
    const calculation = dataValues.reduce((a, b) => a + b, 0);

    cardTitle.textContent = titleText;
    cardValue.textContent = formatter.format(calculation);
}

// Pemanggilan fungsi umum untuk membuat setiap kartu
fetchDataAndUpdateCard(1, 'Amount Merchant', 'amount_merchant');
fetchDataAndUpdateCard(2, 'Total Amount', 'transaction_amount_total');
fetchDataAndUpdateCard(3, 'Amount Delivery', 'amount_delivery');
