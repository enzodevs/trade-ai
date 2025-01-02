// app/page.tsx


import SignalGenerator from "./components/SignalGenerator";
import NotificationManager from "./components/NotificationManager";

export default function Home() {
  return (
    <>
      {/* NotificationManager fica aqui no topo (ou poderia ficar no layout.tsx) */}
      <NotificationManager />

      <main className="min-h-screen w-full flex flex-col items-center justify-start px-4 pt-4">
        
        {/* Header com logo central - reduzimos o mb de 2 para 1 */}
        <header className="mb-1">
        <img src="/logo.png" alt="Logo" width="260" height="260" style={{ objectFit: "cover", objectPosition: "center" }}/>
        </header>
        
        {/* Grid responsivo - reduzimos gap de 8 para 4, mb-12 para mb-6 */}
        <section
          className="
            w-full
            max-w-6xl
            grid 
            grid-cols-1 
            md:grid-cols-2 
            gap-4 
            items-start
            mb-6
          "
        >
          {/* Coluna 1: Gerador de Sinal */}
          <div className="w-full mx-auto max-w-md">
            <SignalGenerator />
          </div>

          {/* Coluna 2: Iframe da Broker */}
          <div className="w-full max-w-md mx-auto">
          <iframe
            src="https://avalonbroker.com/"
            className="
              w-full 
              border 
              rounded-md
              h-[600px]          /* padrão desktop */
              md:h-[600px]       /* mantém 600px em telas md e acima */
              sm:h-[500px]       /* em telas pequenas (sm), 500px */
              xs:h-[450px]       /* em telas bem pequenas (opcional) */
            "
          />
          </div>
        </section>
      </main>
    </>
  );
}
