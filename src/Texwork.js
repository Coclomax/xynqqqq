import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./Texwork.css";

const Texwork = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      const db = getFirestore();
      const docRef = doc(db, "chk", "maintenance");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setIsMaintenance(docSnap.data().maintenance);
      }
    };

    fetchMaintenanceStatus();
  }, []);

  if (!isMaintenance) {
    return null;
  }

  return (
    <div className="texwork">
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      <div className="texwork-container">
        <h1>Maintenance Mode</h1>
        <p>
          Our service is temporarily unavailable due to maintenance work. Please
          check back later.
        </p>
      </div>
    </div>
  );
};

export default Texwork;