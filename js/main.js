//Function Chart Customer
async function chartCustomer() {
    var ctx = document.getElementById('firstChart').getContext('2d');
    var ctx2 = document.getElementById('secondChart').getContext('2d')

    const response = await fetch('datas/data_mart_customer.json');
    const jsonData = await response.json();

    const kecamatanCounts = {}
    const genderCounts = {};
    const rangeAgeCounts = {
        '15 s/d 24': { Male: 0, Female: 0 },
        '25 s/d 34': { Male: 0, Female: 0 },
        '35 s/d 50': { Male: 0, Female: 0 }
    };

    // Mengelompokkan berdasarkan rentang usia dan gender
    jsonData.fact.forEach((transaction) => {
        const gender = transaction.customer_gender;
        const rangeAge = transaction.range_age_customer;
        const kecamatan = transaction.customer_kecamatan;
        const transactionUse = transaction.transaction_use;

        if (!kecamatanCounts[kecamatan]) {
            kecamatanCounts[kecamatan] = { total: 0 };
        }

        // Count all transactions for initial load
        kecamatanCounts[kecamatan].total += 1;
        kecamatanCounts[kecamatan][transactionUse] = (kecamatanCounts[kecamatan][transactionUse] || 0) + 1;

        // Hitung jumlah transaksi berdasarkan gender
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;

        // Hitung jumlah transaksi berdasarkan rentang usia dan gender
        if (rangeAgeCounts[rangeAge]) {
            rangeAgeCounts[rangeAge][gender] = (rangeAgeCounts[rangeAge][gender] || 0) + 1;
        }
    });


    const kecamatanLabel = Object.keys(kecamatanCounts)
    const kecamatanData = kecamatanLabel.map(kec => kecamatanCounts[kec].total);
    const genderLabel = Object.keys(genderCounts);
    const genderData = Object.values(genderCounts);

    // Inisialisasi Chart Kelurahan Customer
    // Chart.register(ChartjsPluginSorting)
    const secondChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: kecamatanLabel,
            datasets: [{
                label: 'Jumlah Transaksi per Kecamatan',
                data: kecamatanData,
                backgroundColor: ['rgba(75, 192, 192, 0.5)','rgba(75, 192, 192, 0.5)','rgba(75, 192, 192, 0.5)','rgba(75, 192, 192, 0.5)','rgba(75, 192, 192, 0.5)','rgba(75, 192, 192, 0.5)'],
                borderColor:['rgba(75, 192, 192, 1)','rgba(75, 192, 192, 1)','rgba(75, 192, 192, 1)','rgba(75, 192, 192, 1)','rgba(75, 192, 192, 1)','rgba(75, 192, 192, 1)',],
                borderWidth: 1
            }]
        },
        options: {
            scales:{
                y: {
                    beginAtZero: true
                }
            },
            plugins:{
                sorting:{
                    enable:true,
                    asc:{
                        button:{
                            class:'asc',
                            rightPosition: '150',
                            topPosition: '0'
                        }
                    },
                    desc:{
                        button:{
                            class:'desc',
                            rightPosition: '75',
                            topPosition: '0'
                        }
                    },
                    alphabetical:{
                        button:{
                            display:'none'
                        }
                    },
                    reset:{
                        button:{
                            class:'reset',
                            rightPosition: '0',
                            topPosition: '0'
                        }
                    }
                }
            }
        },

    })

    // Inisialisasi chart dengan data gender
    const firstChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: genderLabel,
            datasets: [{
                label: 'Distribusi Transaksi berdasarkan Gender',
                data: genderData,
                backgroundColor: ['rgba(185,255,213,0.5)', 'rgba(184,184,255,0.5)'],
                borderColor: ['rgba(185,255,213,1)', 'rgba(184,184,255,1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Gender Distribution of Customers'
                }
            },
            aspectRatio: 2
        }
    });

    //Filter First Chart
    const updateChart = (filter) => {
        if (filter === 'all') {
            // Tampilkan data asli berdasarkan gender
            firstChart.data.labels = genderLabel;
            firstChart.data.datasets[0].data = genderData;
            firstChart.data.datasets[0].label = 'Distribusi Transaksi berdasarkan Gender';
        } else if (rangeAgeCounts[filter]) {
            // Filter berdasarkan rentang usia
            const filteredData = genderLabel.map(gender => rangeAgeCounts[filter][gender] || 0);
            firstChart.data.labels = genderLabel;
            firstChart.data.datasets[0].data = filteredData;
            firstChart.data.datasets[0].label = `Distribusi Transaksi pada Rentang Usia ${filter} berdasarkan Gender`;
        }

        // **Pastikan chart diperbarui** setelah perubahan data
        firstChart.update();  // Ini memastikan chart diupdate dengan data baru
    };

    document.getElementById('filterFirstChart').addEventListener('change', function() {
        updateChart(this.value);
    });


    //Filter Second Chart
    const updateSecondChart = (filter) => {
        let label;
        const filteredData = kecamatanLabel.map(kec => {
            if (filter === 'all') {
                label = 'Jumlah Transaksi per Kecamatan';
                return kecamatanCounts[kec].total;
            } else {
                label = `Transaksi ${filter} per Kecamatan`;
                return kecamatanCounts[kec][filter] || 0;
            }
        });
    
        secondChart.data.datasets[0].data = filteredData;
        secondChart.data.datasets[0].label = label;
        secondChart.update();
    };
    
    // Event listener for secondChart filter
    document.getElementById('filterSecondChart').addEventListener('change', function() {
        updateSecondChart(this.value);
    });
}
chartCustomer();


//Function Chart Driver
async function chartDriver(){
    let thirdChart
    var ctx = document.getElementById('thirdChart').getContext('2d')
    const genderFilter = document.getElementById('genderFilter')
    const response = await fetch('datas/data_mart_driver.json')
    const jsonData = await response.json()


    function updateChart() {
        const driverRangeAgeCounts = {}
        const distanceSums = {}
        const selectedGender = genderFilter.value
    
        //Menghitung Jarak Total dengan Total Transaksi Driver
        jsonData.fact.forEach((transaction) =>{
            if(selectedGender === 'all' || transaction.driver_gender === selectedGender){
                const driverRangeAge = transaction.driver_range_age
                const distance = transaction.distance
        
                driverRangeAgeCounts[driverRangeAge] = (driverRangeAgeCounts[driverRangeAge] || 0) + 1
                distanceSums[driverRangeAge] = ((distanceSums[driverRangeAge] || 0) + distance)
            }
        })
    
        //Membuat Labeling
        const rangeAgeLabel = Object.keys(driverRangeAgeCounts)
    
        const rangeAgeData = rangeAgeLabel.map(label => driverRangeAgeCounts[label] || 0)
        const distanceSumData = rangeAgeLabel.map(label => distanceSums[label] || 0)
    
        //Set Datasets
        const countDataset = {
            label: 'Driver Range Age',
            data: rangeAgeData,
            backgroundColor: ['rgba(194,131,94, 0.5)'],
            borderColor: ['rgba(194,131,94, 1)'],
            borderWidth: 1,
            yAxisID: 'y1',
            type: 'bar',
            fill:false
        }
        const distanceSumDatasets = {
            label: 'Driver Distance',
            data: distanceSumData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y2',
            type: 'line',
            tension: 0.5
        }
    
        if(thirdChart) thirdChart.destroy()
    
        thirdChart = new Chart(ctx,{
            data:{
                labels: rangeAgeLabel,
                datasets: [countDataset, distanceSumDatasets]
            },
            options:{
                responsive: true,
                scales: {
                    y1: {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Transaction Count'
                        }
                    },
                    y2: {
                        type: 'linear',
                        position: 'right',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Distance'
                        },
                        grid: {
                            drawOnChartArea: false 
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                        },
                    }
                },
                plugins:{
                    title:{
                        display: true,
                        text: 'Driver Productivity'
                    },
                },
                transitions:{
                    show:{
                        animations:{
                            x:{
                                from:0
                            },
                            y1:{
                                from:0
                            },
                            y2:{
                                from:0
                            }
                        }
                    },
                    hide:{
                        animations:{
                            x:{
                                to:0
                            },
                            y1:{
                                to:0
                            },
                            y2:{
                                to:0
                            }
                        }
                    }
                }
            }
        })
    }
    genderFilter.addEventListener('change', updateChart)
    updateChart()
}
chartDriver()



async function chartTransaction() {
    let fourthChart
    var ctx = document.getElementById('fourthChart').getContext('2d')

    const response = await fetch('datas/data_mart_transaction.json')
    const jsonData = await response.json()
    const totalAmountSums = {}
    const categoryCounts = {}
    jsonData.fact.forEach((transaction)=>{
        const category = transaction.category_name
        const totalAmount = transaction.transaction_amount_total
        let sortCategory = {}

        categoryCounts[category] = (categoryCounts[category] || 0) + 1
        totalAmountSums[category] = (totalAmountSums[category] || 0) + totalAmount

    })
    console.log(categoryCounts)

    const categoryLabel = Object.keys(categoryCounts)
    const categoryData = Object.values(categoryCounts)
    const totalAmountSumsData = totalAmountSums


    //set dataset
    const categoryDatasets = {
        label: 'Category Transaction',
        data: categoryData,
        backgroundColor: ['rgba(194,131,94, 0.5)'],
        borderColor: ['rgba(194,131,94, 1)'],
        borderWidth: 1,
        yAxisID: 'y1',
        type: 'bar',
        fill:false
    }

    const totalAmountDataset = {
        label: 'Total Amount',
        data: totalAmountSumsData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y2',
        type: 'line',
        tension: 0.5
    }

    fourthChart = new Chart(ctx,{
        data:{
            labels:categoryLabel,
            datasets:[categoryDatasets, totalAmountDataset]
        },
        options:{
            scales:{
                y1: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Transaction Count'
                    }
                },
                y2: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Amount'
                    },
                    grid: {
                        drawOnChartArea: false 
                    }
                },
            },
            plugins:{
                title:{
                    display: true,
                    text: 'Comparison Category and Amount'
                },
            },
        }
    })
}
chartTransaction()


