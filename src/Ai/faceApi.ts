import * as faceapi from 'face-api.js';

const MODEL_URL = process.env.PUBLIC_URL + '/models';

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
]).then(() => {
    console.log('All models loaded');
})

const compareFileImageWithImages = async (file: File, imageURLs: string[]) => {


    const selectedImage = await faceapi.bufferToImage(file);



    const images = await Promise.all(imageURLs.map(async (url) => {
        const img = await faceapi.fetchImage(url);
        return img;
    }))


    const detection1 = await faceapi.detectSingleFace(selectedImage).withFaceLandmarks().withFaceDescriptor()
    //throw error
    if (!detection1) {
        throw new Error('no_face_detected1' as faceDetectionError);
    }
    const descriptor1 = detection1!.descriptor


    //gets mean of distances
    let distances = await Promise.all(images.map(async (img) => {
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        if (!detection) {
            return null;
        }
        const descriptor = detection!.descriptor
        return faceapi.euclideanDistance(descriptor1, descriptor)
    }))
    let filteredDistances = distances.filter(d => d != null) as number[];
    if (filteredDistances.length == 0) {
        throw new Error('no_face_detected2' as faceDetectionError);
    }

    const meanDistance = filteredDistances.reduce((a, b) => a + b, 0) / distances.length //mean of distances

    return meanDistance

}

const compareFileImageWithFileImages = async (file: File, imageURLs: File[]) => {


    const selectedImage = await faceapi.bufferToImage(file);



    const images = await Promise.all(imageURLs.map(async (url) => {
        const img = await faceapi.bufferToImage(url);
        return img;
    }))


    const detection1 = await faceapi.detectSingleFace(selectedImage).withFaceLandmarks().withFaceDescriptor()
    //throw error
    if (!detection1) {
        throw new Error('no_face_detected1' as faceDetectionError);
    }
    const descriptor1 = detection1!.descriptor


    //gets mean of distances
    let distances = await Promise.all(images.map(async (img) => {
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        if (!detection) {
            return null;
        }
        const descriptor = detection!.descriptor
        return faceapi.euclideanDistance(descriptor1, descriptor)
    }))
    let filteredDistances = distances.filter(d => d != null) as number[];
    if (filteredDistances.length == 0) {
        throw new Error('no_face_detected2' as faceDetectionError);
    }

    const meanDistance = filteredDistances.reduce((a, b) => a + b, 0) / distances.length //mean of distances

    return meanDistance

}


export { faceapi, compareFileImageWithImages };

export type faceDetectionError='no_face_detected1'|'no_face_detected2'