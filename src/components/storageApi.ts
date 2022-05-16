import {Storage} from "@capacitor/storage"
import { User } from "./interfaces/@entities"

//user storage class
export class UserStorage{
    //get user from storage
    static async getUser():Promise<User|null>{
        const val= await Storage.get({key:"user"})  
        if(val.value){
            return JSON.parse(val.value)
        }
        return null
    }
    //set user to storage
    static async setUser(user:any){
        return await Storage.set({key:"user",value:JSON.stringify(user)})
    }
    //remove user from storage
    static async removeUser(){
        return await Storage.remove({key:"user"})
    }
}
