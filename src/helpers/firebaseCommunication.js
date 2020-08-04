import { auth, realTime, db} from "../services/firebase";
import { message, notification } from 'antd';
//this function gets all of a users stocks
export async function getPortfolio(){
    try{
        const userID = await auth().currentUser.uid.toString();
        console.log('userID',userID);
        const docRef = db.collection('userData').doc(userID);
        const doc = await docRef.get();
        console.log('doc', doc.exists);
        if (doc.exists){
            //If the user has a portfolio,
            const portfolio =  await docRef.collection('positions').get();
            console.log(portfolio);
            return portfolio;
        } else {
            return null;
        }
    } catch(error){
        console.log(error);
        message.error('There was an error getting the users portfolio.');
        return null;
    }
}


//TODO: Create a validator for tickers instead of assuming all are valid.
export async function addPosition(values, cost){
    const newPosition = {
        exchange: values.exchange,
        category: values.category,
        shares: Number(values.shares),
        cost: Number(cost),
        dateAdded: [new Date()]
    }

    let tickerExists = await isTickerNew(values.ticker);
    if (!tickerExists){
        let success = await addTicker(values.ticker, values.exchange);
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
    return await updatePosition(userID, values.ticker, newPosition);
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
                exchange: newPosition.exchange,
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
        let docRef = db.collection('userData').doc(userID);
        await docRef.set({creationDate: new Date()});
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


