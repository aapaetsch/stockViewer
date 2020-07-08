import { auth } from '../services/firebase';
import { message } from 'antd';

export function signup(email, password){
    let usr = auth().createUserWithEmailAndPassword(email, password);
    return usr;
}

export function signin(email, password){
    let usr = auth().signInWithEmailAndPassword(email, password);
    return usr;
}

export function signInWithProvider(providerName){
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
    return auth().signInWithPopup(provider);
}

export async function sessionPersistence(remember){
    try {
        let persistenceStatus;
        if (remember){
            persistenceStatus = await auth().setPersistence(auth().Auth.Persistence.LOCAL);
            return persistenceStatus;
        } else {
            persistenceStatus = await auth().setPersistence(auth().Auth.Persistence.SESSION);
            return persistenceStatus;
        }
    } catch(error) {
        console.log('persistence error:', error);
        message.error('Error login will not be remembered.');
        return false;
    }
}