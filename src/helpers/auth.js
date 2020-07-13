import { auth } from '../services/firebase';
import { message } from 'antd';

export async function signup(email, password){
    try{
        await auth().createUserWithEmailAndPassword(email, password);
        return true;
    } catch(error){
        console.log(error);
        return false;
    }
}

export async function signin(email, password){
    try{
        await auth().signInWithEmailAndPassword(email, password);
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

export async function signInWithProvider(providerName){
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
        await auth().signInWithPopup(provider);
        return true;
    } catch(error){
        console.log(error);
        return false;
    }

}

export async function sessionPersistence(remember){
    try {
        if (remember){
            await auth().setPersistence(auth().Persistence.LOCAL);
        } else {
            await auth().setPersistence(auth().Persistence.SESSION);
        }
        return true;
    } catch(error) {
        console.log('persistence error:', error);
        message.error('Error login will not be remembered.');
        return false;
    }
}

export async function logout(){
    return auth().signOut();
}