import { IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react'
import { chevronBack } from 'ionicons/icons'
import React, { useState } from 'react'
import { Transaction, User } from '../components/interfaces/@entities'
import { v4 as uuid4 } from "uuid"
import { SignUpResponse, TemplateResponse } from '../components/interfaces/@api'
import axios from 'axios'
import { backendEndPoints } from '../components/Api_urls'


const transaction_categories = [
    "Food",
    "Clothing",
    "Entertainment",
    "Transportation",
    "Education",
    "Health",
    "Emergency",
    "Other"

]

const defaultTransaction: Transaction = {
    amount: 0,
    category: "Food",
    receiver_name: "",
    sender_name: "",
    sender_photo: "",
    receiver_photo: "",
    created_at: new Date().getTime(),
    id: "",
    ref: "",
    type: "transfer",
    receiver_id: "",
    sender_id: "",
    day: (new Date()).getDay() + "",
    month: (new Date()).getMonth() + "",
    time: (new Date()).getTime() + "",
    lat: "0",
    lng: "0",
}


const FinalizePayment: React.FC<{ isOpen: boolean, onDidDismiss: () => void, receiver: User }> = ({ isOpen, onDidDismiss, receiver }) => {
    const [loading, setloading] = useState(false)
    const [amount, setamount] = useState(100);
    const [category, setcategory] = useState("Food");
    const [ref, setref] = useState("");
    let client: User = receiver;

    //function to initiate Payment
    const initiatePayment = async (ev: any) => {


        ev.preventDefault();

        if (!category) {
            alert("Please add a category")
            return
        }

        setloading(true)
        //get transaction details
        const transactionDetail: Transaction = {
            amount,
            category,
            created_at: new Date().getTime(),
            receiver_name: receiver.name,
            receiver_photo: receiver.photo,
            receiver_id: receiver.email,
            sender_name: client.name,
            sender_photo: client.photo,
            sender_id: client.email,
            id: uuid4(),
            ref,
            type: 'transfer',
            day: (new Date()).getDay() + "",
            month: (new Date()).getMonth() + "",
            time: (new Date()).getHours() + "",
            lat: client.lat,
            lng: client.lng,
        }
        try {
            //send transaction details to server
            const response = await (await axios.post(backendEndPoints.payment, transactionDetail)).data as TemplateResponse

            console.log(response)

            if (response.status === 200) {
                alert("Payment Initiated")
                onDidDismiss()
            }
            else {
                alert("Payment Failed \n" + response.message)
            }
        } catch (err) {
            alert("Payment Error\n" + err)
        }
        setloading(false)

    }


    return (
        <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} >
            <IonHeader >
                <IonToolbar>
                    <IonButtons slot="start" onClick={onDidDismiss}>
                        <IonButton>
                            <IonIcon icon={chevronBack} />
                            <IonLabel>Back</IonLabel>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Finalize Payment</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={loading} onDidDismiss={() => setloading(false)} message="Please Hold On"></IonLoading>
                <br />
                <br />
                <form onSubmit={initiatePayment}>
                    <IonCardContent>
                        <IonItem fill="outline" color="none" className="ion-margin-bottom">
                            <IonLabel position="floating">Amount</IonLabel>
                            <IonInput required type="number" placeholder="Enter Amount" value={amount} onIonChange={(e) => setamount(+e.detail.value!)} />
                        </IonItem>
                        <IonItem fill="outline" color="none" className="ion-margin-bottom">
                            <IonLabel  >Category</IonLabel>
                            <IonSelect
                                value={category} onIonChange={(e) => setcategory(e.detail.value!)}
                                slot="end">
                                {
                                    transaction_categories.map((category, index) => {
                                        return <IonSelectOption key={index} value={category}>{category}</IonSelectOption>
                                    }
                                    )
                                }
                            </IonSelect>
                        </IonItem>
                        <IonItem fill="outline" color="none" className="ion-margin-bottom">
                            <IonLabel position="floating">Reference</IonLabel>
                            <IonInput required type="text" placeholder="Enter Reference" value={ref} onIonChange={(e) => setref(e.detail.value!)} />
                        </IonItem>
                        <br /><br />
                        <IonToolbar className="ion-padding-horizontal" >
                            <IonButton
                                type="submit"
                                expand='block'
                            >
                                Make Payment
                            </IonButton>
                        </IonToolbar>
                    </IonCardContent>
                </form>
            </IonContent>
        </IonModal>
    )
}

export default FinalizePayment