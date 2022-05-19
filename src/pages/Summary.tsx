import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonNote, IonPage, IonRefresher, IonRefresherContent, IonRouterLink, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import axios from 'axios';
import { chevronDownCircleOutline, fastFood, search } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { backendEndPoints } from '../components/Api_urls';
import CashinModal from '../components/CashinModal';
import CashoutModal from '../components/CashoutModal';
import ExploreContainer from '../components/ExploreContainer';
import { localImages } from '../components/images/images';
import { Transaction, User } from '../components/interfaces/@entities';
import { selectUser } from '../components/States/User-state';
import './pages.css';

//constant profile photo url
export const photo = "https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg"

const Summary: React.FC = () => {

  //user state
  const user: User = useSelector(selectUser)
  const history = useHistory();
  const [cash_in, setcash_in] = useState(false);
  const [cash_out, setcash_out] = useState(false);
  const [transactions, settransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [amount, setamount] = useState("0")

  useEffect(() => {
    if (!user) {
      history.push('/signin')
    }

    setTimeout(() => {
      axios.post(backendEndPoints.transactions, { email: user.email }).then(res => {
        settransactions(res.data.data)
      }).catch(err => {
        console.log(err)
      })
      axios.post(backendEndPoints.balance, { email: user.email }).then(res => {

        const formatedAmount = convertAmount(res.data.data)
        setamount(formatedAmount)


      }).catch(err => {
        console.log(err)
      })
    }, 3000);
  }, [user])




  return (
    <IonPage>
      <IonToolbar className="app-header">
         
           <IonTitle>
             Secure Pay
           </IonTitle>
         <IonImg slot="start" style={{width:"50px"}} src={localImages.logo}></IonImg>
        <IonAvatar onClick={() => history.push("/profile")} className='dp-photo' slot="end">
          <IonImg src={photo}></IonImg>
        </IonAvatar>
      </IonToolbar>
      <IonContent >
        <IonRow>
          <IonCol></IonCol>
          <IonCol size="12" sizeMd="8" sizeLg='6'>
            <div className="ion-padding ion-text-center amount-section">
              <div

              ><IonLabel>Account Balance</IonLabel></div>
              <IonNote className="amount">{amount}</IonNote>
              <small>FCFA</small>

              <IonToolbar className="ion-margin-vertical">
                <IonButtons style={{ margin: "auto", display: "inline" }}>
                  <IonButton
                    onClick={() => { setcash_in(true) }}
                    color="primary" fill='solid'>Cash In</IonButton>
                  <IonButton onClick={() => { setcash_out(true) }} fill='solid' >Cash Out</IonButton>
                </IonButtons>
              </IonToolbar>

            </div>
            <IonToolbar>
              <IonItemDivider className='ion-margin-bottom'>
                <IonLabel>Today's Transactions</IonLabel>
              </IonItemDivider>
              {transactions.map((trans, index) => {
                return (
                  <TransactionSummaryCard transaction={trans} key={index} index={index}></TransactionSummaryCard>
                )
              })

              }
            </IonToolbar>

          </IonCol>
          <IonCol></IonCol>
        </IonRow>
      </IonContent>
      <CashinModal isOpen={cash_in} onDidDismiss={() => { setcash_in(false) }}></CashinModal>
      <CashoutModal isOpen={cash_out} onDidDismiss={() => { setcash_out(false) }}></CashoutModal>
    </IonPage>
  );
};

export default Summary;

const TransactionSummaryCard: React.FC<{ index: number, transaction: Transaction }> = ({ index, transaction }) => {

  const [color, setcolor] = useState(getColorFromIndex(index))
  const [photo, setphoto] = useState("")
  const [transactionName, settransactionName] = useState("")
  const [amountField, setamountField] = useState(<></>)
  const [date, setdate] = useState("")

  const user: User = useSelector(selectUser)

  const { amount, receiver_name, receiver_id, sender_id, receiver_photo, sender_photo, sender_name, type, created_at } = transaction;

  function getPhoto() {

    const formatedAmount = convertAmount(amount)
    if (receiver_id == user.email) {
      setphoto(sender_photo)
      settransactionName(sender_name)
      // parseFloat(amount+"").toFixed(2)
      setamountField(<IonLabel color="success">+{formatedAmount} FCFA</IonLabel>)
    } else {
      setphoto(receiver_photo)
      settransactionName(receiver_name)
      setamountField(<IonLabel color="danger">-{formatedAmount} FCFA</IonLabel>)
    }

  }
  useEffect(() => {
    getPhoto()
    setdate(getTimeAgo(created_at))
  }, [])


  return (
    <IonItem routerLink='/notifications/detail/1' button lines="none" className="trans-card" >
      <IonAvatar slot="start">
        <IonImg src={photo}></IonImg>
      </IonAvatar>
      <IonToolbar style={{ ['--background']: "transparent" }}>
        <IonLabel>{transactionName}</IonLabel>
        <small>{date} </small>
        <IonLabel slot="end">
          {amountField}
        </IonLabel>
      </IonToolbar>
    </IonItem>
  )
}



export function getColorFromIndex(index: number) {
  const colors = ['primary', 'tertiary', 'secondary', 'dark', 'warning', 'success', 'danger', 'pre-primary'].reverse()

  return colors[index % colors.length]
}


// convert amount to readable format
function convertAmount(amount: number) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// get time ago from date
function getTimeAgo(date: number) {
  const time = Date.now();
  const now = date;
  const seconds = Math.round((-now + time) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(weeks / 4.35);
  const years = Math.round(months / 12);

  if (seconds < 60) {
    return `Just now`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks < 4.35) {
    return `${weeks} weeks ago`;
  } else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }

} 