
import { IonAvatar, IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar } from '@ionic/react'
import axios from 'axios';
import { close } from 'ionicons/icons'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { compareFileImageWithImages } from '../Ai/faceApi';
import { fstore, storage } from '../firebase';
import { CameraModal } from '../pages/SignUp';
import { backendEndPoints } from './Api_urls';
import { playAudio } from './audio/audio';
import { defaultTransaction, operators } from './CashinModal';
import { getBalance } from './CashoutModal';
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
 
    const [verifyUser, setverifyUser] = useState(false)
    // front id state
    const [frontId, setfrontId] = useState<File>()


    

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

        await axios.post(backendEndPoints["record-detect"], {
            ...newTransaction
        }).then(res => {
            console.log(res.data.status)

            if (res.data.status == 205) {

                if (res.data.data["safe"] === false) {
                    setverifyUser(true)
                    setloading(false)
                    return;

                }
            }
            if (res.data.status == 200) {
                if (res.data.message.match("fraud")) {
                    setverifyUser(true)
                    setloading(false)
                    return;
                }
                else {
                    setloading(false)
                    onDidDismiss(true)
                    playAudio()
                    alert("Transaction Successfull")
                    settransaction(defaultTransaction)
                    setamount("")

                }
            }
            setloading(false)


           

        }
        ).catch(err => {
            console.log(err)
        }
        )
        setloading(false)


    }
    

     // get front id from user and converts to a file
     async function getFrontIdFile() {
        if (user.id_front) {

            try {


                fetch(user.id_front)
                    .then(async res => {
                        const blob = (await res.blob())
                        setfrontId(new File([blob], "frontId.jpg"))
                    })
            } catch (err) {
                console.log(err)
            }
        }

    }

    // final verification
    async function finalVerification(distance: number, image: Blob | null) {
        // if distance between front id and user facial recognition close

        if (distance > 0.5 && distance < 0.6) {
            let imageDocs = []
            setloading(true)

            try {
                imageDocs = (await fstore.collection("users").doc(user.email).collection("images").get()).docs.map(doc => doc.data().url)
            } catch (err) {
                console.log(err)
            }

            console.log(imageDocs)

            try {
                let distance = 1;
                if (imageDocs.length > 0 && image) {
                    distance = await compareFileImageWithImages(new File([image], "image-file",), imageDocs)
                }
                console.log(distance)
                //checks distance
                if (distance > 0.5) {
                    alert("Face does not match user profile")
                    setloading(false)
                    return
                }
            } catch (err) {
                alert(err)
                setloading(false)
                return;
            }

        }
        if (distance > 0.6) {
            alert("Face does not match user profile")
            setloading(false)
            return
        }

        alert("FACE MATCH SUCCESSFUL")
        playAudio()
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

        setloading(true)
        try {
            console.log("image ", image)
            if (image) {
                const imageRef = storage.ref("faces").child(user.email).child(Date.now() + ".png")
                await imageRef.put(image).then(async res => {
                    const url = await res.ref.getDownloadURL();
                    console.log(url);
                    return await fstore.collection("users").doc(user.email).collection("images").add({ url });
                })

            }
        }
        catch (error) {
            console.log(error)
        }
        const newTransaction: Transaction = {
            ...transaction,
            amount: +amount,
            created_at: Date.now(),
            sender_name: user.name,
            sender_photo: user.photo,
            sender_id: user.email,
            type: 'withdraw',
            ref: "Withdrawal via " + transaction.receiver_id,
            day: (new Date()).getDay() + "",
            month: (new Date()).getMonth() + "",
            time: (new Date()).getHours() + "",
            lat: user.lat,
            lng: user.lng,

        }

        try {
            const acc_balance = await getBalance(user)
            //verify difference between amount and acc_balance
            if (acc_balance && (acc_balance < newTransaction.amount)) {
                alert("Insufficient funds. Left only " + acc_balance + "FCFA in your account")
                return
            }
            else {
                setloading(true)
                console.log(newTransaction)
                const response = await axios.post(backendEndPoints["record-transaction"], newTransaction)
                if (response.status === 200) {
                    setloading(false)
                    onDidDismiss(true)
                    alert("Successfully Performed Cashout")
                    setamount("")
                    playAudio()
                    settransaction(defaultTransaction)
                }
            }
        } catch (err) {
            alert(err)
            setloading(false)
            return
        }



        setloading(false)


    }



 
 

    async function getReceiverInfo() {
        const response = (await axios.post(backendEndPoints.user, {email: "obend@gmail.com" }))


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
        <IonModal onDidPresent={() => { getReceiverInfo(); getFrontIdFile() }} swipeToClose mode="ios" className='cashin-modal' isOpen={isOpen} onDidDismiss={() => onDidDismiss(null)}>
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
            {frontId && <CameraModal frontId={frontId} isOpen={verifyUser} onDidDismiss={(distance, image) => { setverifyUser(false); distance != null && finalVerification(distance, image) }}></CameraModal>}
        </IonModal>
    )
}

export default MoneyTransferModal
