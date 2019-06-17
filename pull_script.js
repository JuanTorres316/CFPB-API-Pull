let startDate = '2019-05-01T00:00:00';
let endDate = '2019-05-31T00:00:00';
let sortBy = 'date_received';
let limit = 15000;
let query = `select * where ((starts_with(upper(\`company\`), upper('Equifax'))
     or starts_with(upper(\`company\`), upper('Experian'))
     or starts_with(upper(\`company\`), upper('TransUnion')))
     and (\`date_sent_to_company\` >= '${startDate}'
     and \`date_sent_to_company\` <= '${endDate}'))
     order by \`date_received\` desc limit ${limit}`;

let url = "https://data.consumerfinance.gov/api/id/s6ew-h6mp.json?$query=" + encodeURI(query);

getDataAndCreateChart().catch(error => {
    console.log(error);
});

async function getDataAndCreateChart() {
    const response = await fetch(url);
    const apiJson = await response.json();

    // list of companies in batch
    let companies = [];
    let complaintsPerCompany = [];

    // Extract all companies from API JSON object
    apiJson.forEach(x => {
        companies.push(x.company);
    });

    companies = getUniqueCompanies(companies);

    companies.forEach(x => {
        complaintsPerCompany.push(getCompaintCount(apiJson)[x]);
    });

    createChart(companies, complaintsPerCompany);
}

// Function to only list unique Companies-using hashtables
function getUniqueCompanies(a) {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

// Function to Get counts of how many Complaints there are per company
function getCompaintCount(input) {
    var arr = input,
        obj = {};
    arr.forEach(x => {
        if (!obj[x.company]) {
            obj[x.company] = 1;
        } else if (obj[x.company]) {
            obj[x.company] += 1;
        }
    })
    return obj;
}

// Draw the chart
function createChart(companies, complaintsPerCompany) {
    var lcx = document.getElementById('Line Chart').getContext('2d');
    var barChart = new Chart(lcx, {
        type: 'horizontalBar',
        data: {
            datasets: [{
                label: "Complaints Received by company",
                backgroundColor: ["rgba(0,0,200,0.2)", "rgba(0,200,0,0.2)", "rgba(200,0,0,0.2)"],
                data: complaintsPerCompany
            }],
            labels: companies
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    gridLines: {
                        display: false
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }
        }
    });
}