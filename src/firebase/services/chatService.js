import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';

export const saveMeeting = async (meetingData) => {
    const ref = collection(db, 'meetings');
    const doc = await addDoc(ref, {
        name: meetingData.name,
        email: meetingData.email,
        purpose: meetingData.purpose,
        preferredTime: meetingData.preferredTime,
        notes: meetingData.notes || '',
        status: 'pending',
        createdAt: serverTimestamp()
    });
    return doc.id;
};
