
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
  apiKey: "AIzaSyCaFhIFjOzAKrdueV8L4_t6i84sxerQy0U",
  authDomain: "login-project-18eca.firebaseapp.com",
  projectId: "login-project-18eca",
  appId: "1:657467004061:web:1deeccfadf70bad49cb074",
};


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
    export { auth, db };