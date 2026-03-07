import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { MessageCircle, Check, Sparkles } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  recommended: boolean;
  features: string[];
  whatsappMessage: string;
}

interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
}

export default function EstrategiaConteudo() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/config/payment-mode").then((r) => r.json()),
      fetch("/api/estrategia/plans").then((r) => r.json()),
      fetch("/api/estrategia/steps").then((r) => r.json()),
    ])
      .then(([config, plansData, stepsData]) => {
        setWhatsappNumber(config.whatsappNumber || "");
        setPlans(plansData);
        setSteps(stepsData);
      })
      .catch(() => {});
  }, []);

  const openWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encoded}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      <Helmet>
        <title>Estratégia de Conteúdo — Kairós</title>
        <meta
          name="description"
          content="Gestão de redes sociais e estratégia de conteúdo alinhada à Cultura do Reino. Planos a partir de R$ 997/mês."
        />
      </Helmet>

      <Navbar />

      {/* ── Hero ── */}
      <section className="min-h-[70vh] flex items-center justify-center bg-background pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-primary font-mono text-xs uppercase tracking-[0.3em] block mb-6"
          >
            Novo serviço
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-display font-bold leading-tight mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Estratégia de Conteúdo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Gestão completa das suas redes sociais com estratégia alinhada à sua
            marca e à Cultura do Reino. Do planejamento à publicação — cuidamos
            de tudo para você.
          </motion.p>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="bg-background pb-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
                className={cn(
                  "relative rounded-2xl border p-8 flex flex-col",
                  plan.recommended
                    ? "ring-2 ring-primary border-primary/30 bg-primary/[0.03]"
                    : "border-border bg-card",
                )}
              >
                {plan.recommended && (
                  <div className="absolute -top-3.5 left-6 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Recomendado
                  </div>
                )}

                <h3 className="font-display font-bold text-xl mb-2 mt-2">
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-display font-bold text-4xl">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openWhatsApp(plan.whatsappMessage)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Contratar via WhatsApp
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section className="bg-muted/30 py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-display font-bold text-center mb-16"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          >
            Como funciona
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                className="text-center"
              >
                <span className="font-mono text-5xl font-bold text-primary/20 block mb-4">
                  {step.number}
                </span>
                <h3 className="font-display font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="bg-background py-24 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-display font-bold mb-4"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          >
            Pronto para transformar sua presença digital?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-muted-foreground mb-8 leading-relaxed"
          >
            Fale com a nossa equipe e descubra como podemos posicionar sua marca
            nas redes sociais com estratégia e propósito.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <button
              onClick={() =>
                openWhatsApp(
                  "Olá! Gostaria de saber mais sobre a Estratégia de Conteúdo da Kairós.",
                )
              }
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
