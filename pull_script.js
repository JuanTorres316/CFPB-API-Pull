let url = "https://data.consumerfinance.gov/api/id/s6ew-h6mp.json?$query=select%20*%20where%20((starts_with(upper(%60company%60)%2C%20upper(%27Equifax%27))%20or%20starts_with(upper(%60company%60)%2C%20upper(%27Experian%27))%20or%20starts_with(upper(%60company%60)%2C%20upper(%27TransUnion%27)))%20and%20(%60date_sent_to_company%60%20%3E%3D%20%272019-05-01T00%3A00%3A00%27%20and%20%60date_sent_to_company%60%20%3C%3D%20%272019-05-31T00%3A00%3A00%27))%20order%20by%20%60date_received%60%20desc%20limit%2015000";

getData().catch(error =>{
        console.log(error);
});

    async function getData(){

    const response = await fetch(url);
    const apiJson = await response.json();

    
//list of companies in bacth
    let companies = [];
    let countForEach = [];
//Funtion to extract all companies from API JSON object
    apiJson.forEach(x=>{
      companies.push(x.company);
    });

//Function to only list unique Companies-unisg hashtables
    function uniq(a) {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }

    companies = uniq(companies);
    
//Function to Get counts of how many Complaints there are per company
    function getItems(input) {
        var arr = input, obj = {};
            arr.forEach(x=>{
              if (!obj[x.company]) {
                obj[x.company] = 1;
              } else if (obj[x.company]) {
                obj[x.company] += 1;
              }
            })
        return obj;
      }


    companies.forEach(x=>{
        countForEach.push(getItems(apiJson)[x]);
    });


//Make the Chart
    var lcx = document.getElementById('Line Chart').getContext('2d');
    var barChart = new Chart(lcx,{
        type:'horizontalBar',
        data:{
            datasets:[{
                label: "Complaints Received by company",
                backgroundColor: ["rgba(0,0,200,0.2)","rgba(0,200,0,0.2)","rgba(200,0,0,0.2)"] ,
                data:countForEach,

            }],
                labels: companies
            },
        options:{
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    gridLines: {
                        display:false
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display:false
                    }
                }]
            }
        }

    });
}



