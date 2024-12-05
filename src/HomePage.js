import React, { useState, useEffect } from "react";
import { db, doc, getDoc, setDoc, updateDoc } from "./firebase"; 
import sha256 from "crypto-js/sha256";
import './HomePage.css';
import { Link } from 'react-router-dom';

const roundToNearestDecimal = (num, decimalPlaces = 1) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
};

const HomePage = () => {
  const [blocksMined, setBlocksMined] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [lastBlocks, setLastBlocks] = useState([]);
  const [miningAttempts, setMiningAttempts] = useState(0);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);

  const MAX_BLOCKS = 1000000;

  useEffect(() => {
    const telegram = window.Telegram.WebApp;
    telegram.ready();

    const tgUser = telegram.initDataUnsafe?.user;

    if (tgUser && tgUser.id) {
      setUser(tgUser);
      fetchBalance(tgUser.id);
    } else {
      console.error("User data is not available");
    }
  }, []);

  const fetchBalance = async (userId) => {
    const userDocRef = doc(db, "hash", userId.toString());
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      setBalance(userDocSnap.data().balance || 0);
    } else {
      await setDoc(userDocRef, { balance: 0 });
      setBalance(0);
    }
  };

  const updateBalance = async (newBalance) => {
    if (user) {
      const userDocRef = doc(db, "hash", user.id.toString());
      await updateDoc(userDocRef, { balance: newBalance });
      setBalance(newBalance);
    }
  };

  const mineBlock = async () => {
    try {
      setIsMining(true);

      let nonce = 0;
      let blockHash = "";
      const target = "0".repeat(difficulty);
      const blockData = `User-mined block by ${user?.first_name || "Unknown"}`;

      let totalReward = 0; 

      while (true) {
        nonce++;
        setMiningAttempts(prevAttempts => prevAttempts + 1); 

        const timestamp = new Date().toISOString();
        const previousHash = "0";
        blockHash = calculateHash(nonce, blockData, timestamp, previousHash);

        if (blockHash.startsWith(target)) {
          totalReward = roundToNearestDecimal(miningAttempts / 100000 * 0.5, 1);

          const blockInfo = {
            blockId: blocksMined + 1,  
            userId: user?.id || "unknown",  
            blockHash,  
            difficulty, 
            reward: totalReward, 
            timestamp, 
            blockData,  
          };

          const response = await fetch("https://serv.sp1project.ru/mine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blockInfo),
          });

          if (!response.ok) {
            throw new Error("Error while adding block to server.");
          }

          const newBalance = balance + totalReward;
          await updateBalance(newBalance);
          break;
        }

        if (nonce % 100 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));  
        }
      }
    } catch (error) {
      console.error("Mining error:", error);
    } finally {
      setIsMining(false);
    }
  };

  const calculateHash = (nonce, blockData, timestamp, previousHash) => {
    return sha256(nonce + blockData + timestamp + previousHash).toString();
  };

  useEffect(() => {
    fetchBlocksCount();
    fetchDifficulty();
    fetchLastBlocks();

    const intervalId = setInterval(() => {
      fetchBlocksCount();
      fetchDifficulty();
      fetchLastBlocks();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchBlocksCount = async () => {
    try {
      const response = await fetch("https://serv.sp1project.ru/blocks-count");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBlocksMined(data.blockCount || 0);
    } catch (error) {
      console.error("Error fetching block data:", error);
    }
  };

  const fetchDifficulty = async () => {
    try {
      const response = await fetch("https://serv.sp1project.ru/difficulty");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDifficulty(data.difficulty || 0);
    } catch (error) {
      console.error("Error fetching difficulty:", error);
    }
  };

  const fetchLastBlocks = async () => {
    try {
      const response = await fetch("https://serv.sp1project.ru/latest-blocks");
      const data = await response.json();

      const sortedBlocks = data.latestBlocks
        ? data.latestBlocks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        : [];

      setLastBlocks(sortedBlocks);
    } catch (error) {
      console.error("Error fetching latest blocks:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
        <div className="homepage">
        
          <div data-v-aa8b41f1="" class="w-full flex flex-col items-center score_block gap-2 relative">
          <div data-v-aa8b41f1="" class="floating-text-container">
          </div><div data-v-aa8b41f1="" class="mining-info mt-5">
          <h4 data-v-aa8b41f1="" class="text-md font-bold text-white mb-3 mt-6">Мой профиль</h4>
          <div class="page_box__ieb7m">
            <div class="page_key_value__PpC_S">
          <span>Баланс</span>
          <span class="page_value__TBNb5">{balance}</span></div>
          <div class="page_key_value__PpC_S">
            </div>
            <div class="page_key_value__PpC_S">
          <span>Энергия</span><span class="page_value__TBNb5">1024.00</span></div>
          <div class="page_key_value__PpC_S">
          </div></div>
          <h4 data-v-aa8b41f1="" class="text-md font-bold text-white mb-3 mt-6">Информация</h4>
          <div class="page_box__ieb7m"><div class="page_key_value__PpC_S">
          <span>Блок</span><span class="page_value__TBNb5">#{blocksMined}</span>
          </div><div class="page_key_value__PpC_S">
            <span>Сложность</span>
            <span class="page_value__TBNb5">{difficulty}</span>
            </div>
            <div class="page_key_value__PpC_S">
          <span>Награда</span><span class="page_value__TBNb5">1024.00</span></div>
          <div class="page_key_value__PpC_S"><span>В сети</span>
          <span class="page_value__TBNb5">2</span>
          </div></div>
          <h4 data-v-aa8b41f1="" class="text-md font-bold text-white mb-3 mt-6">Майнинг</h4>
          <div class="page_box__ieb7m"><div class="page_key_value__PpC_S">
          <span>Статус</span><span class="page_value__TBNb5">Ожидание</span>
          </div><div class="page_key_value__PpC_S">
            <span>Shares</span>
            <span class="page_value__TBNb5">0</span>
            </div>
            <div class="page_key_value__PpC_S">
          <span>Хэши</span><span class="page_value__TBNb5">{miningAttempts}</span></div>
          <div class="page_key_value__PpC_S"><span>Доход</span>
          <span class="page_value__TBNb5">{balance}</span>
          </div></div>
          
          <div className="info-container">
            {user && <p>User ID: {user.id}</p>}
          </div>
          <button
            className="start-button"
            onClick={mineBlock}
            disabled={isMining}
          >
            {isMining ? "Mining in progress..." : "Start Mining"}
          </button>
          <div className="last-blocks">
            <h3>Последние блоки</h3>
            {lastBlocks.length > 0 ? (
              <ul>
                {lastBlocks.map((block, index) => (
                  <li key={index}>
                    <strong>Block {block.id}:</strong> {formatTimestamp(block.timestamp)}
                    <br />
                    <em>{block.hash}</em>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No blocks mined yet.</p>
            )}
          </div>
        </div>
        </div>
        </div>
    </>
  );
};

export default HomePage;