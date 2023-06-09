import { db } from "../firebase/config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  //cleanup - deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const auth = getAuth(); //Firebase - Authentication

  function checkIfIsCancelled() {
    //cleanup - deal with memory leak
    if (cancelled) {
      return;
    }
  }

  // Register
  const createUser = async (data) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(null);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(user, {
        displayName: data.displayName,
      });
      setLoading(false);
      return user;
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      // Tratar error pra português
      let systemErrorMessage;
      if (error.message.includes("Password")) {
        systemErrorMessage = "A senha deve conter pelo menos 6 caracteres!";
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado!";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setLoading(false);
      setError(systemErrorMessage);
    }
  };

  // Logout
  const logout = () => {
    checkIfIsCancelled();
    signOut(auth);
  };

  // Login
  const login = async (data) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(false);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(false);
    } catch (error) {
      // Tratar error pra português
      let systemErrorMessage;
      if (error.message.includes("user-not-found")) {
        systemErrorMessage = "Usuário não encontrado.";
      } else if (error.message.includes("wrong-password")) {
        systemErrorMessage = "Senha incorreta.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setError(systemErrorMessage);
      setLoading(false);
    }
  };

  // Reset de email
  const emailReset = async (data) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(false);

    try {
      await sendPasswordResetEmail(auth, data.email);
      console.log("Email enviado");
      setLoading(false);
    } catch (error) {
      // Tratar error pra português /* Mudar */
      let systemErrorMessage;
      if (error.message.includes("invalid-email")) {
        systemErrorMessage = "Esse email não é valido.";
      } else if (error.message.includes("user-not-found")) {
        systemErrorMessage = "Não existe usuário com esse email.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setError(systemErrorMessage);
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    error,
    loading,
    logout,
    login,
    emailReset,
  };
};
