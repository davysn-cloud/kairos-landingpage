import { motion, AnimatePresence } from "framer-motion";
import { useRef, useCallback, useState } from "react";
import gsap from "gsap";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const services = [
  {
    number: "01",
    title: "Branding & Identidade Visual",
    description:
      "Construímos marcas que carregam a Cultura do Reino — do conceito estratégico à expressão visual que ecoa propósito.",
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&q=80&fit=crop",
  },
  {
    number: "02",
    title: "Desenvolvimento de Artistas",
    description:
      "Posicionamos artistas como embaixadores culturais, desenvolvendo sua identidade, narrativa e presença no mercado criativo.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&fit=crop",
  },
  {
    number: "03",
    title: "Editorial & Livros",
    description:
      "Do conceito à publicação — criamos projetos editoriais que transformam mensagens em obras que permanecem.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80&fit=crop",
  },
  {
    number: "04",
    title: "Moda & Produtos",
    description:
      "Desenvolvemos roupas e produtos que vestem propósito — cada peça é um sinal da Pátria Celestial em território terreno.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop",
  },
  {
    number: "05",
    title: "Audiovisual & Vídeos",
    description:
      "Produzimos conteúdo audiovisual que captura a beleza do Reino — vídeos, filmes e narrativas visuais que impactam.",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80&fit=crop",
  },
  {
    number: "06",
    title: "Estratégia & Cultura do Reino",
    description:
      "Planejamento estratégico para empreendedores e ministérios que desejam manifestar o Reino através da inovação e criatividade.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&fit=crop",
  },
];

export function ServicesSection() {
  const previewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // GSAP quickTo for buttery smooth tracking
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  const initQuickTo = useCallback(() => {
    if (!previewRef.current || xTo.current) return;
    xTo.current = gsap.quickTo(previewRef.current, "x", { duration: 0.55, ease: "power3.out" });
    yTo.current = gsap.quickTo(previewRef.current, "y", { duration: 0.55, ease: "power3.out" });
  }, []);

  const handleMouseEnter = useCallback((image: string) => {
    initQuickTo();
    if (imgRef.current) imgRef.current.src = image;
    gsap.to(previewRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
  }, [initQuickTo]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const section = sectionRef.current;
    if (!section || !xTo.current || !yTo.current) return;
    const rect = section.getBoundingClientRect();
    // Offset so preview appears to the right and slightly above cursor
    xTo.current(e.clientX - rect.left + 24);
    yTo.current(e.clientY - rect.top - 80);
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(previewRef.current, { opacity: 0, scale: 0.92, duration: 0.25, ease: "power2.in" });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="section-swiss bg-background relative"
    >
      {/* Magnetic preview — desktop only, absolutely positioned, follows mouse */}
      <div
        ref={previewRef}
        className="pointer-events-none absolute z-50 w-[280px] h-[190px] rounded-2xl overflow-hidden shadow-2xl hidden md:block"
        style={{ opacity: 0, scale: 0.92, top: 0, left: 0 }}
      >
        <img
          ref={imgRef}
          src=""
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-20 flex items-end justify-between gap-8">
          <div>
            <div className="overflow-hidden mb-8">
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE }}
                className="text-primary font-mono text-xs uppercase tracking-[0.3em] block"
              >
                O que fazemos
              </motion.span>
            </div>
            <div className="mb-1">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                className="swiss-title font-display font-bold"
              >
                Marcas. Artistas.
              </motion.h2>
            </div>
            <div>
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                className="swiss-title font-display font-bold italic text-muted-foreground"
              >
                Livros. Produtos.
              </motion.h2>
            </div>
          </div>

          {/* Counter */}
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="hidden md:block font-mono text-xs text-muted-foreground tracking-widest shrink-0 pb-3"
          >
            6 serviços →
          </motion.span>
        </div>

        {/* Editorial Stack — one row per service */}
        <div className="divide-y divide-border">
          {services.map((service, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <motion.div
                key={service.number}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                className="group relative py-8 md:py-12 md:cursor-none cursor-pointer"
                onMouseEnter={() => handleMouseEnter(service.image)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
              >
                {/* Top border that turns gold on hover */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                  style={{ originX: 0 }}
                  className="absolute top-0 left-0 right-0 h-px bg-border group-hover:bg-primary/50 transition-colors duration-500"
                />

                <div className="grid grid-cols-[4rem_1fr_auto] md:grid-cols-[7rem_1fr_auto] items-start gap-4 md:gap-12">

                  {/* Giant number */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.10 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05 + 0.1, ease: EASE }}
                    className="font-mono text-5xl md:text-8xl font-bold leading-none text-foreground group-hover:text-primary group-hover:!opacity-100 transition-all duration-500 select-none pt-1"
                  >
                    {service.number}
                  </motion.span>

                  {/* Title + mobile accordion description */}
                  <div>
                    <div>
                      <motion.h3
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: i * 0.05 + 0.1, ease: EASE }}
                        className="font-display font-bold leading-tight group-hover:text-primary transition-colors duration-300"
                        style={{ fontSize: "clamp(1.25rem, 3vw, 2.75rem)" }}
                      >
                        {service.title}
                      </motion.h3>
                    </div>

                    {/* Mobile accordion description */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.p
                          key="desc"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="md:hidden overflow-hidden text-sm text-muted-foreground leading-relaxed mt-3"
                        >
                          {service.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Expand chevron — mobile only */}
                  <div className="md:hidden flex items-center self-start pt-2">
                    <motion.svg
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </div>

                  {/* Description — right column desktop only */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: i * 0.05 + 0.2, ease: EASE }}
                    className="hidden md:block text-sm text-muted-foreground leading-relaxed max-w-xs self-center"
                  >
                    {service.description}
                  </motion.p>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
