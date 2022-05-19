import QrcodeDecoder from 'qrcode-decoder';

const qr = new QrcodeDecoder();
const decodeQRFromImage = async (img)=>{
    console.log("image generated")
   return qr.decodeFromImage(img)
}

const decodeQRFromVideoEl = async (vid)=>{
    console.log("image generated")
   return qr.decodeFromVideo(vid)
}
export {decodeQRFromImage, decodeQRFromVideoEl}