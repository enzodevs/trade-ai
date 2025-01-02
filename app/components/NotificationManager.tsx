"use client";

import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { sampleUsers } from "./mockData";

// Interface do objeto de notificação
interface INotification {
  id: number;
  message: string;
}

export default function NotificationManager() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const notificationIdRef = useRef(0);

  const popupSoundRef = useRef<Howl | null>(null);

  // Configurações
  const NOTIFICATION_LIFETIME = 5000;     // 5s na tela
  const NOTIFICATION_DELAY = 90000;       // 1min30s = 90s
  const FIRST_NOTIFICATION_DELAY = 10000; // 10s

  // Carrega o som do popup ao montar
  useEffect(() => {
    popupSoundRef.current = new Howl({
      src: ["/sounds/popup.mp3"] // Ajuste conforme seu arquivo
    });
  }, []);

  // Ao montar, agenda a primeira notificação e depois a cada 90s
  useEffect(() => {
    // Primeira notificação após 10s
    const firstTimer = setTimeout(() => {
      createRandomNotification();
      // Intervalo subsequente
      const interval = setInterval(() => {
        createRandomNotification();
      }, NOTIFICATION_DELAY);
      // Limpamos esse interval no return
      return () => clearInterval(interval);
    }, FIRST_NOTIFICATION_DELAY);

    // Limpamos o timeout se desmontar
    return () => clearTimeout(firstTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Cria notificação aleatória, ex: "Fulano acabou de ganhar R$ XXX com Trade AI" */
  const createRandomNotification = () => {
    // Usuário
    const randomIndex = Math.floor(Math.random() * sampleUsers.length);
    const randomUser = sampleUsers[randomIndex];
    // Valor
    const randomValue = Math.floor(Math.random() * (2000 - 150 + 1)) + 150;
    const message = `${randomUser} acabou de ganhar R$ ${randomValue} com Trade AI!`;

    notificationIdRef.current += 1;
    const newNotif: INotification = {
      id: notificationIdRef.current,
      message
    };

    // Toca som do popup
    if (popupSoundRef.current) {
      popupSoundRef.current.play();
    }

    // Adiciona notificação
    setNotifications((prev) => [...prev, newNotif]);

    // Remove depois de 5s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, NOTIFICATION_LIFETIME);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="
            bg-green-500 
            text-white 
            px-4 
            py-2 
            rounded-lg 
            shadow-lg 
            mb-2
            animate-slideIn
          "
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}
