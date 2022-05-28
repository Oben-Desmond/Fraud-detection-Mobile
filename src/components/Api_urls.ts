

let url ="http://localhost:8000";

// url = "http://192.168.43.45:8000"
 


export const backendEndPoints={
    "sign_in":url+"/api/sign_in/", //email, password required
    "sign_up":url+"/api/sign_up/", //user interface required
    "payment":url+"/api/payment/", //payment interface required
    "cashin":url+"/api/cashin/", //cashin interface required
    "cashout":url+"/api/cashout/", //cashout interface required
    "user":url+"/api/user/", //requires email
    "transactions":url+"/api/transactions/", //requires email
    "balance":url+"/api/balance/", //requires email
    "record-transaction":url+"/api/record-transaction/", //requires email
    "record-detect":url+"/api/record-transaction/detect", //requires transaction info
    "anormal":url+"/api/anormal", //requires email
    "report":url+"/api/report", //report info
    "get-reports":url+"/api/get-reports", //get reports
    "get-admin-summary":url+"/api/admin/summary", //get reports
}