
import { IonAvatar, IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar } from '@ionic/react'
import axios from 'axios';
import { close } from 'ionicons/icons'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { backendEndPoints } from './Api_urls';
import { defaultTransaction, operators } from './CashinModal';
import { Transaction, User } from './interfaces/@entities';
import { selectUser } from './States/User-state';

const MoneyTransferModal: React.FC<{ isOpen: boolean, onDidDismiss: (success: boolean | null) => void, email: string, }> = ({ isOpen, onDidDismiss, email }) => {
    //form states

    const [transaction, settransaction] = useState<Transaction>(defaultTransaction)
    const user: User = useSelector(selectUser)
    const [receiverInfo, setreceiverInfo] = useState<User>()
    // loading
    const [loadingImage, setloadingImage] = useState(false)
    const [loading, setloading] = useState(false)
    const [amount, setamount] = useState("")
    const imageRef = useRef<HTMLIonImgElement>(null)


    //initiate transaction
    async function initiateTransaction(ev: any) {
        ev.preventDefault();
        try {
            parseInt(amount);
        }
        catch (err) {
            alert("Please enter a valid amount")
            return
        }
        if (!amount) {
            alert("Please enter a valid amount")
            return
        }


        let newTransaction: Transaction = {
            ...transaction,
            amount: +amount,
            created_at: Date.now(),
            receiver_name: "",
            receiver_photo: "",
            receiver_id: email,
            sender_id: user.email,
            sender_name: user.name,
            sender_photo: user.photo,
            category: "Transfer",
            type: 'transfer',
            day: (new Date()).getDay() + "",
            month: (new Date()).getMonth() + "",
            time: (new Date()).getHours() + "",
            lat: user.lat,
            lng: user.lng,

        }
        setloading(true)


        // fetch user from database
        if (!receiverInfo?.email) {
            try {
                const response = (await axios.post(backendEndPoints.user, { email }))
                if (response.data.status == 200) {
                    const receiver = response.data.data;

                    newTransaction = {
                        ...newTransaction,
                        created_at: Date.now(),
                        receiver_name: receiver.name,
                        receiver_photo: receiver.photo,
                        receiver_id: email,
                    }
                }
            } catch (err: any) {
                alert(err.message || err)
            }
        }
 
        if(receiverInfo?.email==user.email){
             alert("You can't send money to the same account")
             setloading(false)
             return;
        }

        await axios.post(backendEndPoints["record-transaction"], {
            ...newTransaction
        }).then(res => {
            console.log(res)
            alert("Successfully sent")
            onDidDismiss(true)

        }
        ).catch(err => {
            console.log(err)
        }
        )
        setloading(false)
        // clear form from ev 
        setamount("")


    }

 
 

    async function getReceiverInfo() {
        const response = (await axios.post(backendEndPoints.user, { email }))


        if (response.data.status == 200) {
            const receiver = response.data.data;
            // setreceiverInfo(receiver)
            setreceiverInfo(receiver)
        }
        else{
            alert("User does not Exist with that QR Code!")
            onDidDismiss(null)
        }

    }

    return (
        <IonModal onDidPresent={() => { getReceiverInfo() }} swipeToClose mode="ios" className='cashin-modal' isOpen={isOpen} onDidDismiss={() => onDidDismiss(null)}>
            <IonHeader >
                <IonToolbar style={{ borderRadius: "20px 20px 0 0" }}>
                    <IonTitle>Send Money</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => onDidDismiss(null)}>
                            <IonIcon slot="icon-only" icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="ion-text-center ion-padding">
                    <IonLabel color="primary">Sending to <b>{receiverInfo?.name || ""}</b></IonLabel>
                </div>
                <form onSubmit={initiateTransaction}>
                    <IonCardContent>
                        <div className="ion-padding">
                            <IonItem disabled={loading} className="ion-margin-bottom">
                                <IonLabel position="floating">Amount</IonLabel>
                                <IonInput
                                    onIonChange={(e) => setamount(e.detail.value!)} required
                                    value={amount} type="number" placeholder="Enter Amount" />
                            </IonItem>

                            <IonItem disabled={loading} className="ion-margin-bottom">
                                <IonLabel position="floating">Add Reason</IonLabel>
                                <IonInput value={transaction.ref} onIonChange={(e) => {
                                    settransaction({ ...transaction, ref: e.detail.value! })
                                }}></IonInput>
                            </IonItem>
                            <br />
                            <br />
                            <IonToolbar className="ion-padding-horizontal">
                                <IonButton disabled={loading} type="submit" expand='block'>
                                    {!loading ? "Send Money" : <IonSpinner></IonSpinner>}
                                </IonButton>
                            </IonToolbar>
                        </div>
                    </IonCardContent>
                </form>
            </IonContent>
        </IonModal>
    )
}

export default MoneyTransferModal
