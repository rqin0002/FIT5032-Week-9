import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { useEmulators, emulatorProjectId, firestoreDatabaseId } from '../config.js'

const firebaseConfig = {
  apiKey: 'AIzaSyB02b9MveXGa_3m4E2VgJKGF76bz4gN0dI',
  authDomain: 'fit5032-7b50f.firebaseapp.com',
  projectId: 'fit5032-7b50f',
  storageBucket: 'fit5032-7b50f.firebasestorage.app',
  messagingSenderId: '308362338146',
  appId: '1:308362338146:web:e52f8593e4ab0ae76cd63b'
}

const localConfig = {
  apiKey: 'demo-key',
  authDomain: `${emulatorProjectId}.firebaseapp.com`,
  projectId: emulatorProjectId,
  appId: '1:123456789:web:demo-fit5032-week9'
}

const isNewApp = getApps().length === 0
const firebaseApp = isNewApp
  ? initializeApp(useEmulators ? localConfig : firebaseConfig)
  : getApp()

const db = getFirestore(firebaseApp, firestoreDatabaseId)

const auth = getAuth(firebaseApp)

if (useEmulators && isNewApp) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}

export { firebaseApp, db, auth }
export default db
