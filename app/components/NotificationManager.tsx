"use client";

import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { motion, AnimatePresence } from "framer-motion";
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
    // Ajuste para top-4 right-4, para que os pop-ups fiquem visíveis no topo da tela.
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { duration: 0.3 } }}
            exit={{ x: 100, opacity: 0, transition: { duration: 0.2 } }}
            className="
              bg-gray-800 
              bg-opacity-90
              text-white 
              rounded-md 
              shadow-xl 
              px-4 py-3
              w-64
              border-l-4
              border-green-500
            "
          >
            {notif.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
