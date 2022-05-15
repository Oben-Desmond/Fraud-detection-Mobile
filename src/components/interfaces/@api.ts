export interface SignUpResponse{
    message:string,
    status : number, 
    header:string
}

export interface TemplateResponse{
    message:string,
    status : number, 
    header:string
}

export interface CashinRequest{
    amount:number,
    ref:string,
    category:string,
    user_id:string,
    user_name:string,
    user_photo:string,
    id:string,
}


export interface CashoutRequest{
    amount:number,
    ref:string,
    category:string,
    user_id:string,
    user_name:string,
    user_photo:string,
    id:string,
}


export interface GeoLocationReadableData{
    lat:number,
    lng:number,
    city:string,
    country:string,
    flag:string,

}