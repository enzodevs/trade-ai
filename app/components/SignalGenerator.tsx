"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FiClock, 
  FiTrendingUp, 
  FiTarget, 
  FiArrowUpCircle, 
  FiArrowDownCircle 
} from "react-icons/fi"; 
import { Howl } from "howler";
import { mockData } from "./mockData";

/* ======================
   Funções de data/hora
   ====================== */
function getNextMultipleOf5(date: Date): Date {
  const newDate = new Date(date.getTime());
  const minutes = newDate.getMinutes();
  const remainder = minutes % 5;

  if (remainder !== 0) {
    newDate.setMinutes(minutes + (5 - remainder));
  }
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

function formatHourMinutes(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Formata tempo em mm:ss. (Ex.: 05:00) */
function formatTime(secondsTotal: number) {
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
}



export default function SignalGenerator() {
  // ANIMAÇÃO
  const LOADING_TIME = 8000; // 8s

  // ESTADOS
  const [isGenerating, setIsGenerating] = useState(false);
  const [canGenerate, setCanGenerate] = useState(true);
  const [freezeCounter, setFreezeCounter] = useState(0);

  // DADOS DO SINAL
  const [currentAsset, setCurrentAsset] = useState("");
  const [winRate, setWinRate] = useState(0);
  const [executionTime, setExecutionTime] = useState(""); // "HH:mm"
  const [showSignal, setShowSignal] = useState(false);
  const [operationType, setOperationType] = useState<"call" | "sell">("call");

  // Horário em que a operação acaba (em timestamp Unix)
  const [operationEndTime, setOperationEndTime] = useState<number | null>(null);

  // TEXTO DE LOADING
  const [loadingText, setLoadingText] = useState("Identificando o ativo...");

  // Som do sinal gerado
  const signalSoundRef = useRef<Howl | null>(null);

  /** Carrega o som do "sinal" */
  useEffect(() => {
    signalSoundRef.current = new Howl({
      src: ["/sounds/signal.mp3"] // Ajuste conforme seu arquivo
    });
  }, []);

  /** 
   * Ao montar o componente, checamos se existe "nextSignalTime" no localStorage.
   */
  useEffect(() => {
    const storedNextSignal = localStorage.getItem("nextSignalTime");
    const storedSignalData = localStorage.getItem("signalData");
    const storedEndTime = localStorage.getItem("operationEndTime");

    // Restaura freeze
    if (storedNextSignal) {
      const nextSignalTimestamp = parseInt(storedNextSignal, 10);
      const nowSec = Math.floor(Date.now() / 1000);
      if (nextSignalTimestamp > nowSec) {
        setCanGenerate(false);
        setFreezeCounter(nextSignalTimestamp - nowSec);
      }
    }

    // Restaura dados do sinal, se houver
    if (storedSignalData) {
      const { asset, winRate, executionTime, operation } = JSON.parse(storedSignalData);
      setCurrentAsset(asset);
      setWinRate(winRate);
      setExecutionTime(executionTime);
      setOperationType(operation || "call");
      setShowSignal(true);
    }

    // Restaura endTime da operação
    if (storedEndTime) {
      setOperationEndTime(parseInt(storedEndTime, 10));
    }
  }, []);

  /**
   * Faz a contagem regressiva quando o usuário está bloqueado.
   */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (!canGenerate && freezeCounter > 0) {
      interval = setInterval(() => {
        setFreezeCounter((prev) => prev - 1);
      }, 1000);
    } else if (freezeCounter === 0 && !canGenerate) {
      setCanGenerate(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [freezeCounter, canGenerate]);

  /**
   * Verifica se a operação acabou. 
   * Se sim, limpa o sinal.
   */
  useEffect(() => {
    const checkOperationEnd = setInterval(() => {
      if (operationEndTime) {
        const nowSec = Math.floor(Date.now() / 1000);
        if (nowSec >= operationEndTime) {
          // Operação acabou, limpa sinal
          setShowSignal(false);
          setOperationEndTime(null);
          localStorage.removeItem("operationEndTime");
          localStorage.removeItem("signalData");
        }
      }
    }, 1000);

    return () => clearInterval(checkOperationEnd);
  }, [operationEndTime]);

  /**
   * Gera um novo sinal.
   */
  const handleGenerateSignal = () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setShowSignal(false);
    setLoadingText("Identificando o ativo...");

    // Textos a cada 2s
    const textTimeouts: ReturnType<typeof setTimeout>[] = [];
    textTimeouts.push(setTimeout(() => setLoadingText("Gerando sinal..."), 2000));
    textTimeouts.push(setTimeout(() => setLoadingText("Analisando oportunidades..."), 4000));
    textTimeouts.push(setTimeout(() => setLoadingText("Quase lá..."), 6000));

    // Após 8s finaliza
    setTimeout(() => {
      // 1. Ativo aleatório
      const randomIndex = Math.floor(Math.random() * mockData.length);
      const chosenAsset = mockData[randomIndex].name;
      setCurrentAsset(chosenAsset);

      // 2. WinRate aleatório (80-97)
      const randomWinRate = Math.floor(Math.random() * (97 - 80 + 1)) + 80;
      setWinRate(randomWinRate);

      // 3. Horário de execução (próximo múltiplo de 5)
      const now = new Date();
      const opTime = getNextMultipleOf5(now);
      const opTimeStr = formatHourMinutes(opTime);
      setExecutionTime(opTimeStr);

      // 4. Tipo de operação aleatório
      const opType = Math.random() < 0.5 ? "call" : "sell";
      setOperationType(opType);

      // 5. Bloqueia por 5 min após opTime
      const nextSignalTimestamp = Math.floor(opTime.getTime() / 1000) + 300;
      localStorage.setItem("nextSignalTime", nextSignalTimestamp.toString());
      const nowSec = Math.floor(Date.now() / 1000);
      const freezeSeconds = nextSignalTimestamp - nowSec;
      setCanGenerate(false);
      setFreezeCounter(freezeSeconds);

      // 6. Define endTime da operação (opTime + 5 min)
      // opTime + 5min = nextSignalTimestamp
      // mas note que opTimeStr é quando ENTRA. A operação acaba 5 min DEPOIS disso => opTime + 5
      // Então, operationEndTime = nextSignalTimestamp
      setOperationEndTime(nextSignalTimestamp);
      localStorage.setItem("operationEndTime", nextSignalTimestamp.toString());

      // 7. Salva no storage
      localStorage.setItem(
        "signalData",
        JSON.stringify({
          asset: chosenAsset,
          winRate: randomWinRate,
          executionTime: opTimeStr,
          operation: opType,
        })
      );

      // 8. Finaliza loading
      setIsGenerating(false);
      setShowSignal(true);

      // Toca som do "gerou sinal"
      if (signalSoundRef.current) {
        signalSoundRef.current.play();
      }

      // Limpa timeouts
      textTimeouts.forEach(clearTimeout);
    }, LOADING_TIME);
  };

  /** Define rótulo e ícone para a operação. */
  const operationLabel = operationType === "call" ? "Compra (Call)" : "Venda (Put)";
  const operationIcon = operationType === "call" ? (
    <FiArrowUpCircle className="text-green-400 text-xl" />
  ) : (
    <FiArrowDownCircle className="text-red-400 text-xl" />
  );

  return (
    <div className="flex flex-col items-center justify-center w-full relative overflow-hidden">
      {/* Onda de choque infinita */}
      <InfiniteWaveAnimation />

      {/* CARD principal */}
      <div
        className="
          w-full
          bg-gradient-to-tr 
          from-[#272b2b] via-[#303537] to-[#1f2425]
          rounded-xl 
          shadow-2xl 
          p-6
          relative
          overflow-hidden
          z-10
          animate-scaleIn
        "
      >
        {/* Overlay vibrante */}
        <div
          className="absolute inset-0 bg-[#edb300] mix-blend-multiply opacity-10 pointer-events-none"
          aria-hidden="true"
        />
        
        <div className="relative z-10 flex flex-col items-center space-y-6">
          
          {/* BOTÃO GERAR SINAL */}
          <button
  onClick={handleGenerateSignal}
  disabled={!canGenerate}
  className={`
    px-6 py-3 text-lg font-bold rounded-full 
    transition-all duration-300
    shadow-md
    hover:scale-105 active:scale-95
    ${
      canGenerate
        ? "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 animate-pulseSignal"
        : "bg-gray-500 cursor-not-allowed animate-disabledSignal"
    }
  `}
>
  Gerar Sinal
</button>

          {/* Texto adicional se NÃO estiver gerando e NÃO tiver sinal */}
          {!isGenerating && !showSignal && (
            <p className="text-sm text-gray-300">
              Gere um sinal com inteligência artificial
            </p>
          )}

          {/* Loading */}
          {isGenerating && (
            <div
              className="flex flex-col items-center space-y-4 animate-fadeInUp"
            >
              <SingleProgressBar durationSec={8} barColor="#edb300" />
              <p className="mt-2 text-base text-yellow-200 font-semibold">
                {loadingText}
              </p>
            </div>
          )}

          {/* Dados do Sinal */}
          {showSignal && !isGenerating && (
            <div
              className="
                bg-[#2c3235] 
                bg-opacity-60 
                backdrop-blur-sm 
                p-4 
                rounded-lg 
                shadow-inner 
                w-full 
                max-w-sm 
                flex 
                flex-col 
                space-y-3
                animate-fadeInUp
              "
            >
              <p className="text-xl font-bold text-[#edb300] mb-2">
                Oportunidade encontrada!
              </p>

              <InfoItem
                icon={operationIcon}
                label="Operação"
                value={operationLabel}
              />

              <InfoItem 
                icon={<FiTarget className="text-green-400 text-xl" />} 
                label="Ativo"
                value={currentAsset}
              />
              <InfoItem
                icon={<FiTrendingUp className="text-green-400 text-xl" />}
                label="Probabilidade de vitória"
                value={`${winRate}%`}
              />
              <InfoItem
                icon={<FiClock className="text-yellow-300 text-xl" />}
                label="Horário de execução"
                value={executionTime}
              />
              <InfoItem
                icon={<FiClock className="text-yellow-300 text-xl" />}
                label="Tempo de operação"
                value="5 minutos"
              />
            </div>
          )}

          {/* Mensagem de bloqueio */}
          {!canGenerate && !isGenerating && (
            <p className="text-sm text-gray-300 mt-4 animate-fadeInUp">
              Você poderá gerar outro sinal em{" "}
              <b className="text-gray-100">{formatTime(freezeCounter)}</b>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Barra de progresso única de 8s */
function SingleProgressBar({
  durationSec,
  barColor = "#edb300",
}: {
  durationSec: number;
  barColor?: string;
}) {
  return (
    <div className="relative w-[220px] h-[8px] bg-gray-700 rounded-full overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full animate-progressBar"
        style={{
          animationDuration: `${durationSec}s`,
          background: barColor,
        }}
      />
      <style jsx>{`
        @keyframes progressBar {
          0% {
            width: 0%;
          }
          10% {
            width: 10%;
          }
          40% {
            width: 40%;
          }
          60% {
            width: 60%;
          }
          80% {
            width: 80%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progressBar {
          animation-name: progressBar;
          animation-timing-function: ease-in-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

/** Item de informação */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-2 p-2 bg-black bg-opacity-20 rounded-md">
      <div>{icon}</div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm text-gray-300 font-semibold">{label}</span>
        <span className="text-base text-white font-bold">{value}</span>
      </div>
    </div>
  );
}

/** Onda de choque infinita */
function InfiniteWaveAnimation() {
  return (
    <div className="absolute z-0">
      <div className="w-96 h-96 absolute rounded-full border border-[#edb300] animate-wave" />
      <div className="w-96 h-96 absolute rounded-full border border-[#edb300] animate-wave2" />
      <div className="w-96 h-96 absolute rounded-full border border-[#edb300] animate-wave3" />
      <style jsx>{`
        .animate-wave {
          animation: wave 4s ease-out infinite;
        }
        .animate-wave2 {
          animation: wave 4s ease-out infinite;
          animation-delay: 1.2s;
        }
        .animate-wave3 {
          animation: wave 4s ease-out infinite;
          animation-delay: 2.4s;
        }
        @keyframes wave {
          0% {
            transform: scale(0.3);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
