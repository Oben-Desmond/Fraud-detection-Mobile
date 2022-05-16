

const url ="http://localhost:8000";

export const backendEndPoints={
    "sign_in":url+"/api/sign_in/", //email, password required
    "sign_up":url+"/api/sign_up/", //user interface required
    "payment":url+"/api/payment/", //payment interface required
    "cashin":url+"/api/cashin/", //cashin interface required
    "cashout":url+"/api/cashout/", //cashout interface required
    "user":url+"/api/user/", //requires email
}