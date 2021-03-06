

export interface User{
    name: string;
    email: string;
    password: string;
    created_at: number;
    id_front:string, 
    id_back:string,
    phone: string;
    lat:string,
    lng:string,
    city: string;
    country: string;
    photo: string; 
}


export interface Transaction{
    id: string;
    sender_id?: string;
    receiver_id?:string;
    amount: number;
    created_at: number;
    ref: string;
    type: "transfer"|"deposit"|"withdraw";
    category:string;
    sender_photo:string;
    receiver_photo:string;
    receiver_name:string;
    sender_name:string;
    lat:string,
    lng: string,
    month: string;
    day:string,
    time:string

}



export interface Reported{
     
    amount : number;
    created_at: number;
    reported_at: number;
    reporter : string;
    reported : string;
    type : string;
    lng : string;
    lat : string;
    transaction_id : string|number;
}