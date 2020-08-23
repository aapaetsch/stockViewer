import { auth } from '../services/firebase';
const stonkApi = 'http://localhost:5000/stonksAPI/v1'

export async function updateMyTickers(tickers){
    await fetch()
}

export async function getMultipleTickers(type, arg, tickers){
    try{
        const result = await fetch(`${stonkApi}/${type}/multiple?${arg}=${tickers}`);
        return await result.json();

    } catch (error){
        console.log(error);
        return null
    }
}

export async function getSingleTicker(type, arg, ticker){
    try{
        const result = await fetch(`${stonkApi}/${type}/single?${arg}=${ticker}`);
        return await result.json();

    } catch (error){
        console.log(error);
        return null;
    }
}

export async function checkTickerExists(ticker){
    try {
        const response = await fetch(`${stonkApi}/single/exists?ticker=${ticker}`);
        return await response.json();

    } catch (error){
        console.log(error)
        return null
    }
}


export async function getAllOf(type, form){
    let connectionString = `${stonkApi}/${type}/all?form=${form}`;
    try{
        const result = await fetch(connectionString);
        return await result.json();

    } catch(error){
        console.log(error);
        return null;
    }
}