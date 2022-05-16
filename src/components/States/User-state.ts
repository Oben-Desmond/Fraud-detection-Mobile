import { User } from "../interfaces/@entities";

const initState:User={
     created_at:Date.now(),
    name:"",
    email:"",
    password:"",
    city:"",
    country:"",
    phone:"",
    id_back:"",
    id_front:"",
    lat:"",
    lng:"",
    photo: "",
    
}

//actions
export const updateUser = (payload:User) => {
    return {
        type: "UPDATE_USER",
        payload
    }
}


//reducer
const userReducer = (state = initState, action:any) => {
    switch (action.type) {
        case "UPDATE_USER":
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

//select user
export const selectUser = (state:any) => state.user

export default userReducer