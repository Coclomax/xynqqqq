import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { saveUserData } from "./firebase";
import useTelegram from "./tg";
import "./Check.css";

const Check = ({ setHasPassedCheck }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(null); 
  const userData = useTelegram();

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, "chk", "maintenance");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsMaintenance(docSnap.data().maintenance);
        } else {
          console.error("Документ 'maintenance' не найден.");
        }
      } catch (error) {
        console.error("Ошибка проверки статуса техработ:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    checkMaintenanceStatus();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (isMaintenance) {
      navigate("/tex");
      return;
    }

    if (userData) {
      saveUserData(userData)
        .then(() => {
          setHasPassedCheck(true);
          navigate("/m");
        })
        .catch((error) => {
          console.error("Ошибка при сохранении данных пользователя:", error);
          navigate("/error");
        });
    }
  }, [isLoading, isMaintenance, userData, navigate, setHasPassedCheck]);

  useEffect(() => {
    const snowflakesCount = 100;
    const snowflakesContainer = document.querySelector(".snowflakes");

    for (let i = 0; i < snowflakesCount; i++) {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");
      snowflake.style.left = `${Math.random() * 100}vw`;
      snowflake.style.animationDuration = `${Math.random() * 3 + 7}s`;
      snowflakesContainer.appendChild(snowflake);
    }
  }, []);

  return (
    <div className="check-container">
      <div className="snowflakes"></div>
      {isLoading ? <div className="spinner"></div> : <p>Redirecting...</p>}
    </div>
  );
};

export default Check;