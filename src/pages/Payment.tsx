import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonNote, IonPage, IonRouterLink, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { fastFood, search } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { User } from '../components/interfaces/@entities';
import FinalizePayment from './FinalizePayment';
import QrCode from "qrcode";
import './pages.css';

import './payment.css';
import { photo } from './Summary';
import { useSelector } from 'react-redux';
import { selectUser } from '../components/States/User-state';
import { decodeQRFromImage, decodeQRFromVideoEl } from '../components/QRCode';
import { localImages } from '../components/images/images';
import MoneyTransferModal from '../components/MoneyTransferModal';



const qr_image = "https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/core_market_full/generator/dist/generator/assets/images/websiteQRCode_noFrame.png"

const Payment: React.FC = () => {

  // state to toggle receiving and sending
  const [transferType, settransferType] = useState<'send' | 'receive'>('receive')
  const [sendMoney, setsendMoney] = useState(false)
  const [loading, setloading] = useState(false)
  const [receiverEmail, setreceiverEmail] = useState("")
  const vidRef = useRef<HTMLVideoElement>(null)
  const history = useHistory();
  // qr code state
  const [qrCodeImage, setqrCodeImage] = useState("")
  const user: User = useSelector(selectUser)
  // paymen done state
  const [paymentDone, setpaymentDone] = useState(false)

  let receiver: User = {
    name: "",
    photo: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    created_at: 0,
    id_back: "",
    id_front: "",
    lat: "",
    lng: "",
    password: "",
  };

  

  // get video feed from camera
  const getVideo = async () => {
    if (!vidRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        // facingMode: 'user'
        facingMode: "environment"


      }
    })
    vidRef.current!.srcObject = stream
    vidRef.current!.play()
    decodeQRFromVideoEl(vidRef.current!).then(res => {
      console.log(res.data)
      setreceiverEmail(res.data)
      setsendMoney(true)
    })
  }
  // stop video feed
  const stopVideo = () => {

    if (vidRef.current?.srcObject) {
      vidRef.current!.pause()

      //close media mediaDevices
      const stream = vidRef.current!.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      vidRef.current!.srcObject = null
      settransferType('receive')
    }
  }

  useEffect(() => {
    if (transferType == "send" && !paymentDone) {
      getVideo()
    }
    else {
      stopVideo()
    }

    
    return () => {
      stopVideo()
    }
  }, [transferType, paymentDone])

  useEffect(() => {
    QrCode.toDataURL(user.email, (err, url) => {
      setqrCodeImage(url)
    })
  }, [])

  //initiate Payment
  function initiatePayment() {

  }

  return (
    <IonPage>
      <IonToolbar className="app-header">
        {transferType == "receive" ? <IonButton
          onClick={() => {
            settransferType('send')
          }}
          fill='outline' slot="start">
          Send
        </IonButton> :
          <IonButton
            onClick={() => { stopVideo(); }}
            fill='outline' slot="start">
            Receive
          </IonButton>}
        <IonAvatar className='dp-photo' slot="end">
          <IonImg src={user.photo}></IonImg>
        </IonAvatar>
      </IonToolbar>
      <IonContent >
        <IonRow>
          <IonCol></IonCol>
          <IonCol size="12" sizeMd="6" sizeLg="4">
            {!paymentDone && <div className=" content ion-padding">
              {transferType == 'receive' ? <div className="center-content receiving ion-text-center">
                <IonImg style={{ minHeight: "100px" }} src={qrCodeImage}></IonImg>
                <small><IonText color="primary">SCAN QR Code with Sender's device</IonText></small>
              </div> :
                <div className="center-content sending ion-text-center">
                  <video ref={vidRef} style={{ width: "100%", margin: "20px 0", border: "2px solid var(--ion-color-primary)" }}></video>
                  <small><IonText color="primary">Scan Receiver's QR Code</IonText></small>
                </div>}
            </div>}
            {
              paymentDone && <div className="ion-padding ion-text-center">
                <IonImg src={localImages.logo} />
                <div>
                  <h2>
                    <IonNote>Payment Successful</IonNote>
                  </h2>
                </div>
                <IonToolbar>
                  <IonButton onClick={() =>{ setpaymentDone(false); settransferType("receive")}} style={{ margin: "auto" }} color="dark">Initiate New Transaction</IonButton>
                </IonToolbar>
              </div>
            }
            <br />

          </IonCol>
          <IonCol></IonCol>
        </IonRow>
      </IonContent>
      {/* <FinalizePayment receiver={receiver} onDidDismiss={() => { setsendMoney(false) }} isOpen={sendMoney} ></FinalizePayment> */}
      <MoneyTransferModal isOpen={sendMoney && !!receiverEmail} onDidDismiss={(success) => {
        setsendMoney(false);
        setreceiverEmail("");
        
        if (success) {
          setpaymentDone(true)
        }
        decodeQRFromVideoEl(vidRef.current!).then(res => {
          console.log(res.data)
          setreceiverEmail(res.data)
          setsendMoney(true)
        })

      }} email={receiverEmail}></MoneyTransferModal>
    </IonPage >
  );
};

export default Payment;
