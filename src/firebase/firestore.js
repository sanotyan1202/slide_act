import firebaseApp from '@/firebase/init.js'
import 'firebase/firestore'

const firestore = firebaseApp.firestore()

export default firestore