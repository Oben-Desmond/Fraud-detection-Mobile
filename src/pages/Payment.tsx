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

const qr_image = "https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/core_market_full/generator/dist/generator/assets/images/websiteQRCode_noFrame.png"

const Payment: React.FC = () => {

  // state to toggle receiving and sending
  const [transferType, settransferType] = useState<'send' | 'receive'>('send')
  const [sendMoney, setsendMoney] = useState(false)
  const vidRef = useRef<HTMLVideoElement>(null)
  const history = useHistory();
  // qr code state
  const [qrCodeImage, setqrCodeImage]  = useState("")
  const user : User = useSelector(selectUser)

  let receiver: User={
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
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user'
      }
    })
    vidRef.current!.srcObject = stream
    vidRef.current!.play()
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
    if (transferType == "send") {
      getVideo()
    }
    else {
      stopVideo()
    }
    return () => {
      stopVideo()
    }
  }, [transferType])

  useEffect(() => {
    QrCode.toDataURL(user.email,(err, url )=>{
          setqrCodeImage(url)
    })
  },[])

//initiate Payment
   function initiatePayment(){
     
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
          <IonImg src={photo}></IonImg>
        </IonAvatar>
      </IonToolbar>
      <IonContent >
        <div className=" content ion-padding">
          {transferType == 'receive' ? <div className="center-content receiving ion-text-center">
            <IonImg src={qrCodeImage}></IonImg>

            <small><IonText color="primary">Currently receiving</IonText></small>
          </div> :
            <div className="center-content sending ion-text-center">
              <video ref={vidRef} style={{ width: "100%", margin: "20px 0" }}></video>
              <small><IonText color="primary">Currently receiving</IonText></small>
            </div>}
        </div>
        <br />
        <div className="ion-padding">
          <IonButton onClick={()=>{setsendMoney(true)}} >
            Done Scanning
          </IonButton>
        </div>
      </IonContent>
      <FinalizePayment receiver={receiver} onDidDismiss={()=>{setsendMoney(false)}} isOpen={sendMoney} ></FinalizePayment>
    </IonPage >
  );
};

export default Payment;
