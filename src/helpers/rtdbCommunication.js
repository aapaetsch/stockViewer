import { auth, realTime } from '../services/firebase';
import { checkTickerExists } from "./APICommunication";


export async function addPosition(values, cost){
    const currentUser = auth().currentUser;
    if (currentUser === null){
        return [false, null];
    }
    const uid = currentUser.uid;
    const data = checkTickerExists(values.ticker);

    if (data === null){
        return false
    }

    const ticker = values.ticker.replace('.', '_');
    const docRef = realTime.ref('/portfolios/'+uid+'/'+ticker);
    const doc = await docRef.once('value');

    if (doc.exists()){
        return await updatePosition(uid, values, cost, doc);
    } else {
        try {
            const date = await new Date();
            const perShare = (Number(cost)/Number(values.shares)).toFixed(4);
            const newPosition = {
                category: values.category,
                shares: Number(values.shares),
                cost: Number(cost),
                transactions: [{date: date.toString(), transaction:`${values.shares} shares bought @ $${perShare} ea`}]
            }
            let writeSuccess = true;
            await docRef.set(newPosition, (error) => {
                if (error){
                    writeSuccess = false;
                }
            });
            return [writeSuccess, 'add'];

        } catch(error) {
            console.log(error);
            return [false, 'add'];
        }
    }
}

export async function updatePosition(uid, values, cost, doc){
    //This function is only for increasing the shares in a position/ adding a new position
    const ticker = values.ticker.replace('.', '_');
    const docRef = realTime.ref('/portfolios/'+uid+'/'+ticker);
    try {
        const previousDoc = doc.val();
        const prevShares = doc.val().shares;
        const prevSector = doc.val().category;
        const newCost = Number(cost) + Number(doc.val().cost);
        const newShares = Number(prevShares) + Number(values.shares);
        const perShare = (Number(cost)/Number(values.shares)).toFixed(4);

        const updatedPosition = {
            category: values.category,
            shares: newShares,
            cost: newCost,
        }

        const payload = [values.ticker.toUpperCase(), [prevShares, newShares], newCost, [prevSector, values.category]];
        let updateSuccess = true;
        let transactionSuccess = true;
        await docRef.update(updatedPosition, (error) => {
            if (error){
                updateSuccess = false;
            }
        });
        if (updateSuccess){
            // update the transaction
            const t = {
                date: new Date().toString(),
                transaction: `${Number(values.shares)} shares bought @ $${perShare} ea`
            }
            await docRef.child('/transactions/').push().set(t, (error) => {
                if (error) {
                    transactionSuccess = false;
                }
            });
        }

        //Revert the transaction if any part fails.
        if (!transactionSuccess){
            await docRef.update(previousDoc);
            updateSuccess = false;
        }

        return [updateSuccess, 'update', payload];

    } catch(error) {
        console.log(error);
        return [false, 'update', null];
    }
}

function logTransaction(uid, ticker, type, data){
    const transactionRef = realTime.ref('/portfolios/'+uid+'/'+ticker+'/transactions').push();
    if (type === 'buy'){
        let dataString = `${data[0]} shares bought @ $${data[1]} ea`;
        return transactionRef.set({transactionTime: new Date(), transaction: dataString}, (error) => {
            if (error){
                console.log(error);
                return false;
            }
            return true;
        });
    }
}

export async function deleteStock(uid, values, cost){
//TODO: add delete stocks
}


