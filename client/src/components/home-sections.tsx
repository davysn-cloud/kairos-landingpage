import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[800px] w-full overflow-hidden bg-foreground">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-aircraft.png"
          alt="Kairos Aircraft"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-display font-medium text-white leading-[1.1] mb-8">
            Kairos: A brand <br />
            <span className="text-white/60 italic">designed</span> to take flight.
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
             <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg">
                Discover the Vision
             </Button>
             <button className="flex items-center gap-3 text-white group hover:text-primary transition-colors">
                <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all">
                   <Play fill="currentColor" className="w-5 h-5 ml-1" />
                </div>
                <span className="font-medium tracking-wide">Watch the Film</span>
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ContentBlock({ 
  title, 
  subtitle, 
  description, 
  image, 
  reverse = false 
}: { 
  title: string, 
  subtitle: string, 
  description: string, 
  image: string, 
  reverse?: boolean 
}) {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center`}>
          <motion.div 
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <span className="text-primary font-mono text-sm uppercase tracking-widest mb-4 block">{subtitle}</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-8 leading-tight">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {description}
            </p>
            <Button variant="link" className="p-0 text-foreground font-semibold hover:text-primary transition-colors group">
              Learn more <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
