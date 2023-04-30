export const ExchangeRate = () => {
  var myHeaders = new Headers();
  myHeaders.append("apikey", "4sCvqsIE6SywuiZPwdAyGbU8IJh454d4");

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  const result = fetch("https://api.apilayer.com/exchangerates_data/convert?to=USD&from=INR&amount=2000", requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

  return result;
};
