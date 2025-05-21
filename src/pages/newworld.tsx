import React from "react";
import { useNavigate } from "react-router-dom";
import GlitchText from "@/components/GlitchText";
import GlitchButton from "@/components/GlitchButton";
import MatrixRain from "@/components/MatrixRain";
import SecretCounter from "@/components/SecretCounter";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

const externalIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="inline w-4 h-4 ml-1 align-text-bottom opacity-70"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 13.5V19.125A2.625 2.625 0 0 1 15.375 21.75H5.625A2.625 2.625 0 0 1 3 19.125V8.625A2.625 2.625 0 0 1 5.625 6h5.625M15.75 3h5.25m0 0v5.25m0-5.25L10.5 14.25" />
  </svg>
);

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.6, type: "spring" },
  }),
};

const NewWorld: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center w-screen min-h-screen overflow-hidden font-mono text-white bg-black">
      <MatrixRain className="z-0" speed={1.2} density={1.1} color="#39ff14" />
      {/* Overlay para melhorar contraste */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-3xl p-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full"
        >
          <GlitchText
            text="Bem-vindo ao Novo Mundo!"
            intensity="high"
            className="mb-6 text-4xl font-bold text-center sm:text-5xl drop-shadow-lg"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-[#39ff14] mb-8 text-center max-w-xl mx-auto"
          >
            Você completou a experiência digital. Agora, o verdadeiro desafio começa. Explore as possibilidades, conecte-se com a comunidade e faça parte da próxima era!
          </motion.p>
        </motion.div>
        <motion.div
          className="grid w-full grid-cols-1 gap-6 mb-8 md:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{}}
        >
          {[{
            title: "Comunidade",
            desc: "Junte-se ao nosso Discord e troque ideias com outros exploradores.",
            link: "https://discord.gg/tempospace",
            color: "#39ff14",
            border: "border-[#39ff14]",
            label: "Entrar no Discord",
          }, {
            title: "Repositório",
            desc: "Veja o código-fonte, contribua ou crie sua própria experiência.",
            link: "https://github.com/TempoLabsAI",
            color: "#9b59b6",
            border: "border-[#9b59b6]",
            label: "Acessar GitHub",
          }, {
            title: "Próximos Passos",
            desc: (
              <ul className="pl-5 space-y-1 list-disc">
                <li>Participe de eventos e desafios exclusivos.</li>
                <li>Receba novidades e atualizações em primeira mão.</li>
                <li>Desbloqueie conquistas e segredos avançados.</li>
              </ul>
            ),
            border: "border-[#ff0033] md:col-span-2",
            color: "#ff0033",
            label: "Voltar ao Início",
            action: () => navigate("/"),
          }].map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03, boxShadow: `0 4px 32px 0 ${card.color}33` }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`transition-all duration-200 ${card.border}`}
            >
              <Card className={`bg-[#18181b] ${card.border} shadow-lg h-full flex flex-col justify-between`}> 
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeof card.desc === "string" ? <p>{card.desc}</p> : card.desc}
                </CardContent>
                <CardFooter>
                  {card.link ? (
                    <GlitchButton tabIndex={0} aria-label={card.label} className="focus:ring-2 focus:ring-[#39ff14]">
                      <a
                        href={card.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                        tabIndex={-1}
                      >
                        {card.label} {externalIcon}
                      </a>
                    </GlitchButton>
                  ) : (
                    <GlitchButton onClick={card.action} tabIndex={0} aria-label={card.label} className="focus:ring-2 focus:ring-[#ff0033]">
                      {card.label}
                    </GlitchButton>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="w-full max-w-xs mb-8"
        >
          <div className="relative group">
            <SecretCounter />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.2rem] bg-black/80 text-xs text-[#39ff14] px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-[#39ff14]">
              Progresso de segredos encontrados
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <GlitchButton
            variant="outline"
            onClick={() => navigate("/explore")}
            className="px-8 py-3 text-lg border-[#39ff14] text-[#39ff14] hover:bg-[#18181b] hover:text-white focus:ring-2 focus:ring-[#39ff14]"
            aria-label="Explorar Recursos Avançados"
          >
            Explorar Recursos Avançados
          </GlitchButton>
        </motion.div>
      </div>
    </div>
  );
};

export default NewWorld; 