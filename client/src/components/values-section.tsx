import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const values = [
  {
    title: "Excelência como linguagem",
    description: "Não é opcional — é o padrão de tudo que criamos.",
  },
  {
    title: "Integridade como fundamento",
    description: "A base sobre a qual toda obra é construída.",
  },
  {
    title: "Criatividade guiada pelo Espírito",
    description: "Cada ideia nasce de uma escuta atenta ao que o Céu comunica.",
  },
  {
    title: "Beleza com significado",
    description: "Nada é apenas estética — tudo carrega propósito.",
  },
  {
    title: "Serviço ao Corpo de Cristo",
    description: "Existimos para servir a Igreja e amplificar sua voz.",
  },
  {
    title: "Propósito acima de performance",
    description: "O que importa não é o alcance, mas a profundidade do impacto.",
  },
  {
    title: "Impacto cultural e espiritual",
    description: "Cada projeto é um sinal plantado na cultura.",
  },
  {
    title: "Verdade, unidade e responsabilidade",
    description: "Compromisso com o que é real, junto e responsável.",
  },
  {
    title: "Arte como expressão do Reino",
    description: "Toda criação é um testemunho da Pátria Celestial.",
  },
];

export function ValuesSection() {
  return (
    <section id="valores" className="py-32 bg-muted/50">
      <div className="container mx-auto px-6">
        {/* Title — split into two animated spans */}
        <div className="mb-20 text-center">
          <div className="overflow-hidden mb-6">
            <motion.span
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-primary font-mono text-xs uppercase tracking-[0.3em] block"
            >
              Nossos valores
            </motion.span>
          </div>
          <div className="overflow-hidden mb-1">
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="text-4xl md:text-6xl font-display font-medium"
            >
              O código da
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
              className="text-4xl md:text-6xl font-display font-medium italic text-primary"
            >
              Pátria
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ backgroundColor: "hsl(40 30% 94%)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                default: { duration: 0.6, delay: i * 0.06, ease: EASE },
                backgroundColor: { duration: 0.3 },
              }}
              className="bg-card p-8 md:p-10 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-[10px] font-mono text-primary/60 tracking-widest mt-1.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
