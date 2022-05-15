import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonNote, IonPage, IonRouterLink, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { fastFood, search } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router';
import CashinModal from '../components/CashinModal';
import CashoutModal from '../components/CashoutModal';
import ExploreContainer from '../components/ExploreContainer';
import './pages.css';

//constant profile photo url
export const photo = "https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg"

const Summary: React.FC = () => {

   const history = useHistory();
    const [cash_in, setcash_in] = useState(false);
    const [cash_out, setcash_out] = useState(false);

  return (
    <IonPage>
      <IonToolbar className="app-header">
        <IonButtons>
          <IonButton slot="start">
            <IonIcon icon={search}></IonIcon>
          </IonButton>
        </IonButtons>
          <IonAvatar onClick={()=>history.push("/profile")} className='dp-photo' slot="end">
            <IonImg src={photo}></IonImg>
          </IonAvatar>
      </IonToolbar>
      <IonContent >
        <div className="ion-padding ion-text-center amount-section">
          <div><IonLabel>Account Balance</IonLabel></div>
          <IonNote className="amount">50,000 FCFA</IonNote>
          <IonRow className="ion-margin-vertical">
            <IonCol></IonCol>
            <IonCol> <IonButtons>
              <IonButton
              onClick={() => {setcash_in(true)}}
              color="primary" fill='solid'>Cash In</IonButton>
              <IonButton onClick={() => {setcash_out(true)}} fill='solid' >Cash Out</IonButton>
            </IonButtons></IonCol>
            <IonCol></IonCol>
          </IonRow>
        </div>
        <IonToolbar>
          <IonItemDivider className='ion-margin-bottom'>
            <IonLabel>Today's Transactions</IonLabel>
          </IonItemDivider>
          {[1, 1, 1, 1, 1].map((trans, index) => {
            return (
              <TransactionSummaryCard key={index} index={index}></TransactionSummaryCard>
            )
          })

          }
        </IonToolbar>
      </IonContent>
      <CashinModal isOpen={cash_in} onDidDismiss={()=>{setcash_in(false)}}></CashinModal>
      <CashoutModal isOpen={cash_out} onDidDismiss={()=>{setcash_out(false)}}></CashoutModal>
    </IonPage>
  );
};

export default Summary;

const TransactionSummaryCard: React.FC<{ index: number }> = ({ index }) => {

  const [color, setcolor] = useState(getColorFromIndex(index))



  return (
    <IonItem routerLink='/notifications/detail/1' button lines="none" className="trans-card" >
      <IonButton color={"medium"} fill="clear" slot="start">
        <IonIcon icon={fastFood}></IonIcon>
      </IonButton>
      <IonToolbar style={{ ['--background']: "transparent" }}>
        <IonLabel>Food Stuff</IonLabel>
        <small>2:45pm </small>
        <IonLabel slot="end">
          <IonNote>10,000FCFA</IonNote>
        </IonLabel>
      </IonToolbar>
    </IonItem>
  )
}



export function getColorFromIndex(index: number) {
  const colors = ['primary', 'tertiary', 'secondary', 'dark', 'warning', 'success', 'danger', 'pre-primary'].reverse()

  return colors[index % colors.length]
}