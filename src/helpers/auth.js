import { auth } from '../services/firebase';
import { message } from 'antd';

export async function signup(email, password){
    try{
        return await auth().createUserWithEmailAndPassword(email, password);
    } catch(error){
        console.log(error);
        return false;
    }
}

export async function signin(email, password){
    try{
        return await auth().signInWithEmailAndPassword(email, password);;
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
        return await auth().signInWithPopup(provider);
    } catch(error){
        console.log(error);
        return false;
    }

}

export async function sessionPersistence(credentials, remember){
    try {
        if (remember){
            await credentials.setPersistence(credentials.Persistence.LOCAL);
        } else {
            await credentials.setPersistence(credentials.Persistence.SESSION);
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