export function getCurrencySymbol(currency) {
    const symbols = {
        'EUR':'€', 'GBP':'£', 'CNY':'¥', 'JPY':'¥', 'SEK':'kr',
        'CHF':'Fr.', 'HUF':'Ft', "INR":'₹', "PHP":'₱', 'IDR':'Rp',
        'THB':'฿', 'MYR':'RM', 'ZAR':'R', 'RUB':'₽', 'USD':'$',
        'AUD':"$", 'CAD':'$', 'NZD':'$', 'HKD':'$', 'SGD':"$"}

    let curr = symbols[currency];
    if (curr === undefined){
        curr = '$'
    }

    return curr
}

export function getConversionRatio(currencies, curr1, curr2) {
    //This function finds the conversion ratio between two currencies
    //Converts to usd then to the curr2 if no conversion between curr1 and curr2 exists in the db
    const name = `${curr1}/${curr2}`;
    try{
        return currencies[name].value;

    } catch {

        try{
            return 1 / currencies[`${curr2}/${curr1}`].value;

        } catch {

            try{
                let toUSD;
                let fromUSD;

                try{
                    toUSD = currencies[`${curr1}/USD`].value;

                } catch {
                    toUSD = 1 / currencies[`USD/${curr1}`].value;
                }

                try{
                    fromUSD = currencies[`USD/${curr2}`].value;

                } catch{
                    fromUSD = 1 / currencies[`${curr2}/USD`].value;
                }

                return toUSD * fromUSD;

            } catch {
                return null;
            }
        }
    }
}

