const axios = require('axios');



async function get_the_values(now, next_month, year, month)
{
	console.log("sbw.get_the_values");
	var url = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/redemption_tables";
	var l_params = `?filter=redemp_period:gte:${now},redemp_period:lte:${next_month},issue_year:eq:${year},issue_months:eq:${month},issue_name:eq:Series%20EE`;
	console.log(url+l_params);
	const response = await axios.get(url+l_params);
	return response.data;
}


function get_dollars_and_cents_text(money)
{
	return `$${money}`;
}

function get_dollars_and_cents(money)
{
  var dollars = parseInt(money);
  var zcents = money - dollars;
  var cents = Math.round(zcents * 100);
  var dtext = 'dollars';
  var ctext = 'cents';
  if (dollars == 1)
  {
    dtext = 'dollar';
  }
  
  if (cents == 1)
  {
    ctext = 'cent';
  }
  
  return `${dollars} ${dtext} and ${cents} ${ctext}`;
}


function for_fun(data, value)
{
  var outputData = [];
  if (data.data.length > 0)
  {
   for (var i=0;i<data.data.length;i++)
   {
     var kvp = {};
     kvp.key = data.data[i].redemp_period;
     kvp.value = data.data[i][value];
     outputData.push(kvp);
   }
  }          
  return outputData;
}
    
    
function getSpeechTextFromOutputData(outputData, amount, full_month, year)
{
	var speechText = "";
	if (outputData.length > 0)
	{
		console.log(outputData);
		var money  = outputData[0].value;
		console.log(money);
		var dandc = get_dollars_and_cents_text(money);
		var amount_text = get_dollars_and_cents_text(amount);
		speechText =  `A ${amount_text} savings bond issued in ${full_month} of ${year} is currently worth ${dandc}.`;
		
		var next_money = get_dollars_and_cents_text(outputData[1].value);
		
		var delta = (outputData[1].value - outputData[0].value).toFixed(2);
		speechText += `  It will be worth ${next_money} if you wait until next month.  A differnce of $${delta}.`;
		console.log(speechText);
	}
	else
	{
		speechText = `Sorry, I cannot find any data for a ${amount} dollar bond issued in  ${full_month} of ${year}.`;
		console.log("[ERROR MESSAGE]: " + speechText);
	}
	return speechText
}

exports.get_the_values = get_the_values;
exports.getSpeechTextFromOutputData = getSpeechTextFromOutputData
exports.for_fun = for_fun