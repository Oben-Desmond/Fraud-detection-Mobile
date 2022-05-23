
import { IonAvatar, IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar } from '@ionic/react'
import axios from 'axios';
import { close } from 'ionicons/icons'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { convertAmount } from '../pages/Summary';
import { backendEndPoints } from './Api_urls';
import { defaultTransaction, operators } from './CashinModal';
import { Transaction, User } from './interfaces/@entities';
import { selectUser } from './States/User-state';

const CashinModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void }> = ({ isOpen, onDidDismiss }) => {
    //form states

    const [transaction, settransaction] = useState<Transaction>(defaultTransaction)
    const user: User = useSelector(selectUser)
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
                alert("Insufficient funds. Left only "+acc_balance+"FCFA in your account")
                return
            }
            else {
                // setloading(true)
            //     const response = await axios.post(backendEndPoints.transactions, newTransaction)
            //     if (response.status === 200) {
            //         setloading(false)
            //         onDidDismiss()
            //     }
            }
        } catch (err) {
            alert(err)
            return
        }



        setloading(true)
        await axios.post(backendEndPoints["record-detect"], {
            ...newTransaction
        }).then(res => {
            console.log(res)
            if (res.data.status === 200) {
                res.data["safe"] === false && alert("You have insufficient funds")
            }
            alert(res.data.message)

        }
        ).catch(err => {
            console.log(err)
        }
        )
        setloading(false)
        // clear form from ev 
        setamount("")
        settransaction(defaultTransaction)


    }


    // change selected Operator
    function changeOperator(operatorId: string) {
        const operator = operators.find(operator => operator.code === operatorId)
        if (operator)
            settransaction({ ...transaction, receiver_id: operator.code, receiver_photo: operator.logo, receiver_name: operator.name });
    }
    useEffect(() => {
        if (imageRef.current) {
            imageRef.current.onloadstart = () => {
                setloadingImage(true)
            }
            imageRef.current.onload = () => {
                setloadingImage(false)
            }

        }

    }, [])

    


    return (
        <IonModal swipeToClose mode="ios" className='cashin-modal' isOpen={isOpen} onDidDismiss={() => onDidDismiss()}>
            <IonHeader >
                <IonToolbar style={{ borderRadius: "20px 20px 0 0" }}>
                    <IonTitle>Cash Out</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => onDidDismiss()}>
                            <IonIcon slot="icon-only" icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
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
                                <IonLabel position="floating">Momo Options</IonLabel>
                                <IonSelect onIonChange={(e) => changeOperator(e.detail.value!)} value={transaction.receiver_id}>
                                    {
                                        operators.map((operator, index) => {
                                            return <IonSelectOption key={index} value={operator.code}>{operator.name}  </IonSelectOption>
                                        })
                                    }
                                </IonSelect>
                                {
                                    transaction.receiver_photo && !loadingImage && <IonAvatar slot="end"><IonImg ref={imageRef} src={transaction.receiver_photo} /></IonAvatar>
                                }
                            </IonItem>
                            <IonItem disabled={loading} className="ion-margin-bottom">
                                <IonLabel position="floating">Receiver Phone number</IonLabel>
                                <IonInput value={transaction.category} onIonChange={(e) => {
                                    settransaction({ ...transaction, category: e.detail.value! })
                                }}></IonInput>
                            </IonItem>
                            <br />
                            <br />
                            <IonToolbar className="ion-padding-horizontal">
                                <IonButton disabled={loading} type="submit" expand='block'>
                                    {!loading ? "Cash Out" : <IonSpinner></IonSpinner>}
                                </IonButton>
                            </IonToolbar>
                        </div>
                    </IonCardContent>
                </form>
            </IonContent>
        </IonModal>
    )
}

export default CashinModal




//get account balance
export async function getBalance(user:User): Promise<number | null> {
    return await axios.post(backendEndPoints.balance, { email: user.email }).then(res => {
        if(res.data.status!=200){
            alert(res.data.message)
            return null
        }
        const formatedAmount: number = res.data.data
        return (formatedAmount)
    }).catch(err => {
        console.log(err)
        return null
    })
}