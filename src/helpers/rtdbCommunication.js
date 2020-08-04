import { auth, realTime } from '../services/firebase';
import { message } from 'antd';
const stonkApi = 'http://127.0.0.1:5000/stonksAPI/v1'

export async function addPosition(values, cost){
    const currentUser = auth().currentUser;
    if (currentUser === null){
        return [false, null];
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
            // let prevTransactions = doc.val().transactions;
            let prevShares = doc.val().shares;
            let prevSector = doc.val().category;
            let newCost = Number(cost) + Number(doc.val().cost);
            let newShares = Number(prevShares) + Number(values.shares);
            console.log(prevShares, prevSector, newCost, newShares);


            // prevTransactions.push({transactionTime: new Date(),
            //     transactionType: `${values.shares} added @ $${Number(cost)/Number(values.shares)} ea`});

            const updatedPosition = {
                category: values.category,
                shares: newShares,
                cost: newCost
            }
            let payload = [values.ticker.toUpperCase(), [prevShares, newShares], newCost, [prevSector, values.category]]
            return docRef.update(updatedPosition).then( (error) => {
                let updateSuccess = true;
                if (error){
                    updateSuccess = false;
                }
                return [updateSuccess, 'update', payload];
            });

        } catch(error) {
            console.log(error);
            return [false, 'update', null];
        }
    } else {
        //We must set a new document
        try {
            const perShare = (Number(cost)/Number(values.shares)).toFixed(4);
            const newPosition = {
                category: values.category,
                shares: Number(values.shares),
                cost: Number(cost),
                transactions: {transactionTime: new Date(),
                    transactionType: `${values.shares} shares added @ $${perShare} ea` },
            }
            return docRef.set(newPosition).then( (error) => {
               let addSuccess = true;
               if (error){
                   console.log(error);
                   addSuccess = false;
               }
               return [addSuccess, 'add'];
            });

        } catch(error) {
            console.log(error);
            return [false, 'add'];
        }
    }

}


export async function deleteStock(uid, values, cost){
//TODO: add delete stocks
}


