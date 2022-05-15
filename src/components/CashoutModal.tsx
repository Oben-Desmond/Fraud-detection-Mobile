
import { IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react'
import axios from 'axios';
import { close } from 'ionicons/icons'
import React, { useState } from 'react'
import { backendEndPoints } from './Api_urls';

const CashinModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void }> = ({ isOpen, onDidDismiss }) => {
    //form states
    const [amount, setamount] = useState(100);
    const [category, setcategory] = useState("Food");
    const [ref, setref] = useState("");
    
    //process cash out procedure
    const processCashOut = async (ev: any) => {
        ev.preventDefault();
        //check if all fields are filled
        if (!amount || !category || !ref) {
            alert("Please fill all fields")
            return
        }
        //send request to server
        const response = await axios.post(backendEndPoints.cashout, {
            amount,
            category,
            ref
        })
        //check if request was successful
        if (response.status === 200) {
            //close modal
            onDidDismiss();
        }
    }
    
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
               <form onSubmit={(e) => {}}>
               <IonCardContent>
                    <div className="ion-padding">
                        <IonItem className="ion-margin-bottom">
                            <IonLabel position="floating">Amount</IonLabel>
                            <IonInput required type="number" placeholder="Enter Amount" />
                        </IonItem>
                        <IonItem className="ion-margin-bottom">
                            <IonLabel position="floating">Momo Options</IonLabel>
                            <IonSelect>
                                <IonSelectOption value="">MTN Mobile Money</IonSelectOption>
                                <IonSelectOption value="">Orange Money</IonSelectOption>
                                <IonSelectOption value="">Nexttel Mobile Money</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem className="ion-margin-bottom">
                            <IonLabel position="floating">Receiver Number</IonLabel>
                            <IonInput type="tel" ></IonInput>
                        </IonItem>
                        <br />
                        <br />
                        <IonToolbar className="ion-padding-horizontal">
                            <IonButton type="submit" expand='block'>
                                Cash Out
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
