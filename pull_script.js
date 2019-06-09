let url = "https://data.consumerfinance.gov/resource/s6ew-h6mp.json";

getData().catch(error =>{
	console.log(error);
});

async function getData(){

	const response = await fetch(url);
  const apiJson = await response.json();
	
/*  apiJson.forEach(x=>{
		console.log(x.company);
	});
*/
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

console.log(getItems(apiJson)["TRANSUNION INTERMEDIATE HOLDINGS, INC."]);

}



