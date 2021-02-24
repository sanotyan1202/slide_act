import firebaseApp from '@/firebase/init.js';
import 'firebase/analytics';

const analytics = firebaseApp.analytics()

export default analytics