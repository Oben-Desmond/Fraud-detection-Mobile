
import { IonAvatar, IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonModal, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar } from '@ionic/react'
import axios from 'axios'
import { close } from 'ionicons/icons'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { auth } from '../firebase'
import { backendEndPoints } from './Api_urls'
import { Transaction, User } from './interfaces/@entities'
import { selectUser } from './States/User-state'
export const defaultTransaction: Transaction = {
    id: '',
    amount: 0,
    created_at: 0,
    ref: '',
    type: 'deposit',
    category: '',
    sender_photo: '',
    receiver_photo: '',
    receiver_name: '',
    sender_name: '',
    lng: "0",
    lat: "0",
    day: (new Date()).getDay() + "",
    month: (new Date()).getMonth() + "",
    time: (new Date()).getHours() + "",

};



// fintech money transfer operators
export const operators = [
    {
        name: 'MTN',
        logo: 'https://i0.wp.com/www.smobilpay.cm/wp-content/uploads/2020/06/momo-logo.png?fit=560%2C430&ssl=1',
        code: 'mtn'
    },
    {
        name: 'Airtel',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Airtel_Africa_logo.svg/2037px-Airtel_Africa_logo.svg.png',
        code: 'airtel'
    },
    {
        name: 'Tigo',
        logo: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/042011/untitled-1_18.png?itok=XQu7d_jB',
        code: 'tigo'
    },
    {
        name: 'Orange',
        logo: 'https://www.solutions-numeriques.com/wp-content/uploads/2016/06/orange-money.jpg',
        code: 'orange'
    },
    {
        name: 'Vodafone',
        logo: 'https://logos-world.net/wp-content/uploads/2020/09/Vodafone-Logo.png',
        code: 'vodafone'
    }
]
const CashinModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void }> = ({ isOpen, onDidDismiss }) => {

    const [transaction, settransaction] = useState<Transaction>(defaultTransaction)
    const user: User = useSelector(selectUser)
    // loading
    const [loading, setloading] = useState(false)
    const [loadingImage, setloadingImage] = useState(false)
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
            receiver_id: user.email,
            amount: +amount,
            created_at: Date.now(),
            receiver_name: user.name,
            receiver_photo: user.photo,
            type: 'deposit',
            ref: "Deposit via " + transaction.sender_id,
            day: (new Date()).getDay() + "",
            month: (new Date()).getMonth() + "",
            time: (new Date()).getHours() + "",
            lat: user.lat,
            lng: user.lng,

        }

        setloading(true)
        await axios.post(backendEndPoints["record-transaction"], {
            ...newTransaction
        }).then(res => {
            console.log(res)
            alert("Successfully sent")
            // clear form
            settransaction(defaultTransaction)
            setamount("")

        }
        ).catch(err => {
            console.log(err)
        }
        )
        setloading(false)



    }


    // change selected Operator
    function changeOperator(operatorId: string) {
        const operator = operators.find(operator => operator.code === operatorId)
        if (operator)
            settransaction({ ...transaction, sender_id: operator.code, sender_photo: operator.logo, sender_name: operator.name });
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

    //verify if user exists from endpoint
    function verifyUser(email: string) {

    }


    return (
        <IonModal swipeToClose mode="ios" className='cashin-modal' isOpen={isOpen} onDidDismiss={() => onDidDismiss()}>
            <IonHeader >
                <IonToolbar style={{ borderRadius: "20px 20px 0 0" }}>
                    <IonTitle>Cash In</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => onDidDismiss()}>
                            <IonIcon slot="icon-only" icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonCardContent>
                    <form onSubmit={initiateTransaction}>
                        <div className="ion-padding">
                            <IonItem disabled={loading} className="ion-margin-bottom">
                                <IonLabel position="floating">Amount</IonLabel>
                                <IonInput
                                    onIonChange={(e) => setamount(e.detail.value!)} required
                                    value={amount} type="number" placeholder="Enter Amount" />
                            </IonItem>
                            <IonItem disabled={loading} className="ion-margin-bottom">
                                <IonLabel position="floating">Momo Options</IonLabel>
                                <IonSelect onIonChange={(e) => changeOperator(e.detail.value!)} value={transaction.sender_id}>
                                    {
                                        operators.map((operator, index) => {
                                            return <IonSelectOption key={index} value={operator.code}>{operator.name}  </IonSelectOption>
                                        })
                                    }
                                </IonSelect>
                                {
                                    transaction.sender_photo && !loadingImage && <IonAvatar slot="end"><IonImg ref={imageRef} src={transaction.sender_photo} /></IonAvatar>
                                }
                            </IonItem>
                            <IonItem disabled={loading} className="ion-margin-bottom">
                                <IonLabel position="floating">Payer Phone number</IonLabel>
                                <IonInput value={transaction.category} onIonChange={(e) => {
                                    settransaction({ ...transaction, category: e.detail.value! })
                                }}></IonInput>
                            </IonItem>
                            <br />
                            <br />
                            <IonToolbar className="ion-padding-horizontal">
                                <IonButton disabled={loading} type="submit" expand='block'>
                                    {!loading ? "Cash In" : <IonSpinner></IonSpinner>}
                                </IonButton>
                            </IonToolbar>
                        </div>
                    </form>
                </IonCardContent>
            </IonContent>
        </IonModal>
    )
}

export default CashinModal


