import { Navbar, Footer } from "@/components/layout";
import { Hero, ContentBlock } from "@/components/home-sections";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Intro Text */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="max-w-4xl"
             >
               <h3 className="text-3xl md:text-5xl font-display font-medium leading-tight mb-8">
                 We believe time is not to be spent, but to be savored. 
                 <span className="text-muted-foreground"> Kairos builds aircraft that return the most precious resource to you. Not just moving you from A to B, but elevating the journey between.</span>
               </h3>
             </motion.div>
          </div>
        </section>

        <ContentBlock 
          subtitle="The Experience"
          title="Head in the clouds"
          description="From the moment you step on board, the city noise fades away. Our cabin is designed for tranquility, offering panoramic views and a serene environment that feels less like a commute and more like an exhale."
          image="/images/lifestyle-flight.png"
        />

        <ContentBlock 
          subtitle="Engineering"
          title="Aerodynamics in harmony"
          description="Silence is the new sound of speed. Our distributed electric propulsion system is engineered to be whisper-quiet, blending seamlessly into the urban soundscape while delivering uncompromising performance."
          image="/images/aero-detail.png"
          reverse={true}
        />
        
        {/* Full width visual */}
        <section className="relative py-32 bg-foreground text-white overflow-hidden">
           <div className="absolute inset-0 opacity-40">
              <img src="/images/city-aerial.png" className="w-full h-full object-cover" alt="City Aerial" />
           </div>
           <div className="container mx-auto px-6 relative z-10 text-center">
              <h2 className="text-5xl md:text-7xl font-display font-medium mb-8">The city, unlocked.</h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12">
                Reimagining urban infrastructure to bring flight closer to your doorstep. A network of skyports that connects communities.
              </p>
           </div>
        </section>
        
        {/* Bento Grid Gallery */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-6">
             <div className="mb-16">
               <span className="text-primary font-mono text-sm uppercase tracking-widest mb-4 block">Gallery</span>
               <h2 className="text-4xl font-display font-medium">Visualizing the future</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[400px]">
                <div className="md:col-span-2 row-span-1 rounded-2xl overflow-hidden relative group">
                   <img src="/images/hero-aircraft.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Aircraft" />
                   <div className="absolute bottom-6 left-6 text-white font-medium text-lg">Flight 01</div>
                </div>
                <div className="md:col-span-1 row-span-1 rounded-2xl overflow-hidden bg-muted relative group">
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                       <span className="text-secondary font-display text-9xl font-bold opacity-20 group-hover:opacity-40 transition-opacity">01</span>
                    </div>
                    <div className="absolute bottom-6 left-6 text-foreground font-medium text-lg">The Concept</div>
                </div>
                <div className="md:col-span-1 row-span-1 rounded-2xl overflow-hidden relative group">
                   <img src="/images/aero-detail.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Detail" />
                   <div className="absolute bottom-6 left-6 text-white font-medium text-lg">Materials</div>
                </div>
                 <div className="md:col-span-2 row-span-1 rounded-2xl overflow-hidden relative group">
                   <img src="/images/lifestyle-flight.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Lifestyle" />
                   <div className="absolute bottom-6 left-6 text-white font-medium text-lg">Human Centric</div>
                </div>
             </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
