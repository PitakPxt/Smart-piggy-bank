import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { ref, onValue, set, push, remove } from "firebase/database";
import { realtimeDb } from "../lib/firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    return signOut(auth);
  };

  const getRealtimeDb = (path, callback) => {
    const dataRef = ref(realtimeDb, path);
    return onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  };

  const setRealtimeDb = (path, data) => {
    const dataRef = ref(realtimeDb, path);
    return set(dataRef, data);
  };

  const pushRealtimeDb = (path, data) => {
    const dataRef = ref(realtimeDb, path);
    return push(dataRef, data);
  };

  const removeRealtimeDb = (path) => {
    const dataRef = ref(realtimeDb, path);
    return remove(dataRef);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logIn,
        logOut,
        getRealtimeDb,
        setRealtimeDb,
        pushRealtimeDb,
        removeRealtimeDb,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useUserAuth() {
  return useContext(AuthContext);
}
