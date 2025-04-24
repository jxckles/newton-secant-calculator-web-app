// src/lib/firebaseCalculations.js
import { db } from '../config/firebase-config';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

export async function saveCalculation(userId, calculationId, data) {
  const userRef = doc(db, 'users', userId);
  const calculationRef = doc(userRef, 'calculations', calculationId);
  await setDoc(calculationRef, {
    ...data,
    timestamp: new Date().toISOString()
  }, { merge: true });
}

export async function getCalculations(userId) {
  const userRef = doc(db, 'users', userId);
  const calculationsRef = doc(userRef, 'calculations');
  const snapshot = await getDoc(calculationsRef);
  return snapshot.exists() ? snapshot.data() : {};
}

export function listenToCalculations(userId, callback) {
  const userRef = doc(db, 'users', userId);
  const calculationsRef = doc(userRef, 'calculations');
  return onSnapshot(calculationsRef, (doc) => {
    callback(doc.exists() ? doc.data() : {});
  });
}

export async function deleteCalculation(userId, calculationId) {
  const userRef = doc(db, 'users', userId);
  const calculationRef = doc(userRef, 'calculations', calculationId);
  await deleteDoc(calculationRef);
}