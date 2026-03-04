import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { GraficaNavbar } from "@/components/grafica/grafica-navbar";
import { CategoryCard } from "@/components/grafica/category-card";
import { Footer } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategoryWithCount } from "@shared/types";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
          <Skeleton className="aspect-[4/3]" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GraficaCatalogo() {
  const { data: categories, isLoading } = useQuery<CategoryWithCount[]>({
    queryKey: ["/api/grafica/categories"],
  });

  return (
    <div className="min-h-screen bg-background font-sans">
      <GraficaNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(38_70%_45%/0.08),transparent_70%)]" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl">
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-primary font-mono text-xs uppercase tracking-[0.3em] block mb-6"
            >
              Gráfica Online
            </motion.span>

            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.95] tracking-tight"
            >
              Gráfica{" "}
              <span className="italic text-primary">Kairós</span>
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className="text-lg md:text-xl text-muted-foreground mt-6 max-w-xl font-display"
            >
              Impressos de alta qualidade para sua marca.
              Escolha a categoria e configure seu pedido.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          >
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-display font-bold">Categorias</h2>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            {isLoading ? (
              <CatalogSkeleton />
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, i) => (
                  <CategoryCard key={category.id} category={category} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Nenhuma categoria disponível no momento.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
