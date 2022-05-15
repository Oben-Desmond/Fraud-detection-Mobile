
import { IonButton, IonButtons, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react'
import { close } from 'ionicons/icons'
import React from 'react'

const CashinModal: React.FC<{ isOpen: boolean, onDidDismiss: () => void }> = ({ isOpen, onDidDismiss }) => {
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
                            <IonLabel position="floating">Payer Number</IonLabel>
                            <IonInput></IonInput>
                        </IonItem>
                        <br />
                        <br />
                        <IonToolbar className="ion-padding-horizontal">
                            <IonButton type="submit" expand='block'>
                                Cash In
                            </IonButton>
                        </IonToolbar>
                    </div>
                </IonCardContent>
            </IonContent>
        </IonModal>
    )
}

export default CashinModal
