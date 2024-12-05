import { useEffect, useState } from "react";

const useTelegram = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-web-app.js?56";
    script.async = true;
    script.onload = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const userData = window.Telegram.WebApp.initDataUnsafe;

        if (userData) {
          const webAppUser = {
            id: userData.user.id,
            first_name: userData.user.first_name,
            last_name: userData.user.last_name || '',
            username: userData.user.username || '',
            language_code: userData.user.language_code || '',
            is_premium: userData.user.is_premium || false,
            photo_url: userData.user.photo_url || ''
          };

          setUser(webAppUser);
        }
      } else {
        console.error("Telegram WebApp SDK не был инициализирован должным образом.");
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return user;
};

export default useTelegram;