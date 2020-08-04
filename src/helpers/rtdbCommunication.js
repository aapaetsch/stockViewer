import { auth, realTime } from '../services/firebase';
import { message } from 'antd';
const stonkApi = 'http://127.0.0.1:5000/stonksAPI/v1'

export async function addPosition(values, cost){
    const currentUser = auth().currentUser;
    if (currentUser === null){
        return false;
    }
    const uid = currentUser.uid;
    //TODO: Add Check for valid ticker

    return await updatePosition(uid, values, cost);
}

export async function updatePosition(uid, values, cost){
    //This function is only for increasing the shares in a position/ adding a new position
    const ticker = values.ticker.replace('.', '_');
    const docRef = realTime.ref('/portfolios/'+uid+'/'+ticker);
    const doc = await docRef.once('value').then((response) => {return response});
    if (doc.exists()) {
        //If the doc exists we must update
        try {
            let prevTransactions = doc.val().transactions;
            let prevShares = doc.val().shares;
            prevTransactions.push({transactionTime: new Date(),
                transactionType: `${values.shares} added @ $${Number(cost)/Number(values.shares)} ea`});

            const updatedPosition = {
                category: values.category,
                shares: Number(prevShares.shares) + Number(values.shares),
                cost: Number(cost) + Number(doc.val().cost),
                transactions: prevTransactions
            }
            return await docRef.update(updatedPosition);
        } catch(error) {
            console.log(error);
            return false;
        }
    } else {
        //We must set a new document
        try {
            const newPosition = {
                category: values.category,
                shares: Number(values.shares),
                cost: Number(cost),
                transactions: [{transactionTime: new Date(),
                    transactionType: `${values.shares} shares added @ $${Number(cost)/Number(values.shares)} ea` }],
            }
            return await docRef.set(newPosition);
        } catch(error) {
            console.log(error);
            return false;
        }
    }

}


export async function deleteStock(uid, values, cost){
//TODO: add delete stocks
}


