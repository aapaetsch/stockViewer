import { auth } from '../services/firebase';
import firebase from 'firebase';
import { message } from 'antd';

export async function signup(email, password, remember){
    try{
        return auth().setPersistence(await getPersistence(remember))
            .then( async () => {
                return await auth().createUserWithEmailAndPassword(email, password);
            });
    } catch(error){
        console.log(error);
        return false;
    }
}

export async function signin(email, password, remember){
    try{
        return auth().setPersistence(await getPersistence(remember))
            .then( async () => {
                return await auth().signInWithEmailAndPassword(email, password);
            });
    } catch(error) {
        console.log(error);
        return false;
    }
}

export async function signInWithProvider(providerName, remember){
    let provider;
    switch(providerName){
        case 'google':
            provider = new auth.GoogleAuthProvider();
            break;
        case 'git':
            provider = new auth.GithubAuthProvider();
            break;
        case 'facebook':
            provider = new auth.FacebookAuthProvider();
            break;
        default:
            provider = null;
            break;
    }
    try{
        return auth().setPersistence(await getPersistence(remember))
            .then( async () => {
                return await auth().signInWithPopup(provider);
            });
    } catch(error){
        console.log(error);
        return false;
    }

}

async function getPersistence(remember){
    if (remember){
        return auth.Auth.Persistence.LOCAL;
    }
    return auth.Auth.Persistence.SESSION;
}

export async function logout(){
    return auth().signOut();
}