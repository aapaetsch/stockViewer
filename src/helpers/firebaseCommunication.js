import { auth, realTime, db} from "../services/firebase";
import { message } from 'antd';
//this function gets all of a users stocks
export async function getPortfolio(){
    try{
        await db.collection
    } catch(error){
        console.log(error);
        message.error('There was an error getting the users portfolio.');
    }
}


//TODO: Create a validator for tickers instead of assuming all are valid.
export async function addPosition(ticker, exchange, category, shares, cost){

    const newPosition = {
        exchange: exchange,
        category: category,
        shares: Number(shares),
        cost: Number(cost),
        dateAdded: [new Date()]
    }

    let tickerExists = await isTickerNew(ticker);
    if (!tickerExists){
        let success = await addTicker(ticker, exchange);
    }

    let userID = await auth().currentUser.uid.toString();
    //Check if new user.
    const userPortfolio = db.collection('userData').doc(userID);
    let doc = await userPortfolio.get();
    if (!doc.exists){
        //Make the entire portfolio in userData
        const successfulCreation = await createPortfolioCollection(userID);
        if (!successfulCreation){
            message.error('Error creating user portfolio');
            return successfulCreation;
        }
    }
    return await updatePosition(userID, ticker, newPosition);
}

async function updatePosition(userID, ticker, newPosition){
    //This method will either create a new position for a user or update an existing position.
    const docRef = db.collection('userData').doc(userID)
                            .collection('positions').doc(ticker);
    let doc = await docRef.get();
    if (doc.exists){
        //If adding to an existing position, update it.
        try{
            let data = doc.data();
            data.dateAdded.push(new Date());
            const updatedPosition = {
                category: newPosition.category,
                shares: newPosition.shares + data.shares,
                cost: newPosition.cost + data.cost,
                dateAdded: data.dateAdded,
            }
            await docRef.update(updatedPosition);
            return true;
        } catch(error){
            console.log(error);
            return false;
        }
    } else {
        //Create the position
        try{
            await docRef.set(newPosition);
            return true;
        } catch(error){
            console.log(error);
            return false;
        }
    }
}

async function createPortfolioCollection(userID){
    try{
        await db.collection('userData').doc(userID).collection('portfolio');
        return true;
    } catch(error){
        console.log(error);
        return false;
    }
}


//TODO: add in server function for adding a ticker, validating a ticker
async function addTicker(ticker, exchange){
    //TODO: Here we need to trigger the api function for updating stock data in the db.
    //returns a date if successful, null if not?
    //function checks if the ticker is valid
    let data = {date: new Date(), exchange: exchange.toUpperCase()}
    if (true){
        let res = await db.collection('tickers').doc(ticker).set(data);
        return res;
    }
}

async function isTickerNew(ticker){
    let allStoredTickers = await getAllTickers();
    let tickerExists = false;
    for (let i = 0; i < allStoredTickers.length; i++){
        if (ticker === allStoredTickers[i].id){
            tickerExists = true;
            break;
        }
    }
    return tickerExists;
}

//get all the tickers that have already been added
//returns doc:{ ticker: { lastUpdated: date, exchange: string}, [...] }
export async function getAllTickers(){
    let docRef = db.collection('tickers');
    let snapshot = await docRef.get();
    snapshot.forEach( doc => {
        console.log(doc.id, '==>', doc.data());
    });
    return snapshot;

}
