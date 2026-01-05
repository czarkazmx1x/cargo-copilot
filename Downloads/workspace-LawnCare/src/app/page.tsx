'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, Star, Quote, Phone, Mail, MapPin, Scissors, Sprout, Sun, TreePine, Droplets, Tractor, Menu, X, Calendar, Clock, Award, Shield, ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Parallax ref
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 200])

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
                American Dream <span className="text-secondary">Lawn</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {['Services', 'Reviews', 'Service Area', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium text-white/90 hover:text-secondary transition-colors uppercase tracking-widest text-[11px]"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Button className="hidden md:inline-flex bg-secondary text-secondary-foreground hover:bg-white hover:text-primary transition-all duration-300 font-bold tracking-wide rounded-none px-6">
                GET FREE QUOTE
              </Button>
              <button
                className="md:hidden p-2 text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-4 border-t border-white/10 bg-black/90 backdrop-blur-xl absolute top-20 left-0 w-full px-4"
            >
              {['Services', 'Reviews', 'Service Area', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-sm font-medium text-white hover:text-secondary py-2 border-b border-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-white font-bold rounded-none">
                  Get Free Quote
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Immersive Hero Section */}
        <div ref={targetRef} className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
          {/* Background Video/Image */}
          <motion.div
            style={{ scale, opacity, y }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            {/* Find a high quality video or image. Using a placeholder for now but designed for video */}
            <Image
              src="/images/hero-lawn-house.jpg"
              alt="Luxury Lawn"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Hero Content */}
          <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="mb-6 bg-white/10 text-white backdrop-blur border-white/20 text-xs px-4 py-2 uppercase tracking-[0.2em]">
                  Premium Landscape Services
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-none">
                Elevate Your <br />
                <span className="text-secondary italic font-light">Outdoor Living</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Experience the art of landscaping. We transform ordinary properties into breathtaking sanctuaries in Riverview, Florida.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-7 text-lg rounded-none shadow-2xl shadow-black/20 transition-transform hover:scale-105 border border-white/10">
                  Transform Your Yard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-white hover:bg-white hover:text-black hover:border-white px-10 py-7 text-lg rounded-none border-white/30 backdrop-blur-sm transition-all duration-300">
                  <Phone className="mr-2 h-5 w-5" />
                  (813) 555-1234
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </div>

        {/* Stats Section - Floating */}
        <section className="relative z-30 -mt-24 pb-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white shadow-2xl p-8 md:p-12 rounded-none border-t-4 border-secondary">
              {[
                { label: "Happy Clients", value: "14+" },
                { label: "Star Rating", value: "5.0" },
                { label: "Satisfaction", value: "100%" },
                { label: "Family Owned", value: "Local" },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-2 group-hover:text-secondary transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 skew-x-12" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Our Expertise</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
                  Curated <span className="italic text-primary">Services</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Tailored solutions for discerning homeowners. From meticulous maintenance to complete redesigns.
                </p>
              </div>
              <Button variant="link" className="text-primary hover:text-secondary text-lg group p-0">
                View All Services <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Precision Mowing", desc: "Manicured perfection for your lawn.", icon: Scissors },
                { title: "Landscape Design", desc: "Bespoike outdoor living spaces.", icon: Sprout },
                { title: "Arbor Care", desc: "Expert tree and shrub sculpting.", icon: TreePine },
                { title: "Smart Irrigation", desc: "Efficient water management systems.", icon: Droplets },
                { title: "Soil Health", desc: "Premium fertilization programs.", icon: Tractor },
                { title: "Seasonal Renewal", desc: "Comprehensive spring & fall cleanups.", icon: Sun },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="group h-full border-none shadow-lg bg-white/50 hover:bg-white transition-all duration-500 hover:-translate-y-2 rounded-none overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <CardHeader className="pt-10 pb-6">
                      <div className="h-16 w-16 mb-6 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        <service.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors duration-500" />
                      </div>
                      <CardTitle className="text-2xl font-serif mb-3">{service.title}</CardTitle>
                      <CardDescription className="text-base text-muted-foreground leading-relaxed">
                        {service.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us - Dark Section */}
        <section className="py-24 bg-foreground text-background relative isolate overflow-hidden">
          {/* Decorative BG */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <Image src="/images/grass-texture.jpg" alt="Texture" fill className="object-cover mix-blend-overlay" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[4/5] relative rounded-none border-8 border-white/5 shadow-2xl overflow-hidden">
                  <Image src="/images/hero-lawn-house.jpg" alt="Quality Work" fill className="object-cover" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-secondary p-8 shadow-xl hidden md:block max-w-xs">
                  <p className="font-serif text-3xl font-bold text-foreground mb-2">100%</p>
                  <p className="font-bold text-foreground/80 uppercase tracking-wide text-sm">Satisfaction Guaranteed or we re-do it for free.</p>
                </div>
              </div>

              <div>
                <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Why Choose Us</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">
                  Excellence is in the <span className="text-secondary">Details</span>
                </h2>
                <p className="text-white/80 text-lg mb-10 font-light leading-relaxed">
                  We believe your lawn is an extension of your home. Our commitment to quality, reliability, and professionalism sets us apart in the industry.
                </p>

                <div className="space-y-8">
                  {[
                    { title: "5-Star Concierge Service", desc: "Dedicated account manager for every client.", icon: Award },
                    { title: "Licensed & Insured", desc: "Full protection for your peace of mind.", icon: Shield },
                    { title: "Always On Time", desc: "Reliability you can set your watch by.", icon: Clock },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="flex-shrink-0 h-14 w-14 rounded-full border border-white/20 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                        <p className="text-white/60">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-24 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Loved by Returns
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Jennifer M.",
                  quote: "The team completely transformed our curb appeal. It went from overgrown to 'Home of the Year' worthy in weeks."
                },
                {
                  name: "Robert D.",
                  quote: "Professionalism that is rare to find these days. Uniformed crew, impeccable equipment, and perfect results."
                },
                {
                  name: "Sarah W.",
                  quote: "I never worry about my lawn anymore. It just looks perfect, every single week. Worth every penny."
                }
              ].map((review, i) => (
                <Card key={i} className="border-none shadow-none bg-primary/5 p-8 rounded-none relative">
                  <Quote className="h-10 w-10 text-primary/20 absolute top-8 left-8" />
                  <CardContent className="pt-12 relative z-10">
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-secondary text-secondary" />)}
                    </div>
                    <p className="text-lg font-serif italic text-foreground mb-8">"{review.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div className="font-bold text-sm text-foreground uppercase tracking-wide">{review.name}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-gradient-to-br from-primary to-emerald-900 text-white relative overflow-hidden">
          {/* Abstract shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8">
                  Start Your <br /><span className="text-secondary italic">Transformation</span>
                </h2>
                <p className="text-xl text-white/80 mb-12 font-light max-w-lg">
                  Ready to elevate your property? Contact us today for a consultation and complimentary quote.
                </p>

                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="h-16 w-16 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors duration-300">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-widest text-secondary mb-1">Call Us</p>
                      <p className="text-2xl font-serif">(813) 555-1234</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 group">
                    <div className="h-16 w-16 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors duration-300">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-widest text-secondary mb-1">Email Us</p>
                      <p className="text-2xl font-serif text-white/90">info@americandream.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 group">
                    <div className="h-16 w-16 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors duration-300">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-widest text-secondary mb-1">Serving</p>
                      <p className="text-2xl font-serif text-white/90">Riverview, FL & Surroundings</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-none shadow-2xl">
                <CardHeader className="p-8 pb-2">
                  <CardTitle className="text-2xl font-serif text-white">Request Consultation</CardTitle>
                  <CardDescription className="text-white/60">We generally reply within one business day.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-white/80">First Name</label>
                      <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none focus-visible:ring-secondary" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-white/80">Last Name</label>
                      <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none focus-visible:ring-secondary" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-white/80">Phone</label>
                    <Input className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none focus-visible:ring-secondary" placeholder="(555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-white/80">Service</label>
                    <select className="flex h-10 w-full rounded-none border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option className="bg-primary text-white">Lawn Maintenance</option>
                      <option className="bg-primary text-white">Landscaping Design</option>
                      <option className="bg-primary text-white">Tree Services</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-white/80">Message</label>
                    <Textarea className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-none focus-visible:ring-secondary min-h-[120px]" placeholder="How can we help?" />
                  </div>
                  <Button className="w-full bg-secondary hover:bg-white text-secondary-foreground hover:text-primary font-bold tracking-wide rounded-none h-12 text-lg transition-colors">
                    Send Request
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-16 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-secondary rounded flex items-center justify-center">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-bold">American Dream Lawn</span>
            </div>
            <div className="flex gap-8 text-sm uppercase tracking-widest text-white/60">
              <a href="#" className="hover:text-secondary transition-colors">Privacy</a>
              <a href="#" className="hover:text-secondary transition-colors">Terms</a>
              <a href="#" className="hover:text-secondary transition-colors">Sitemap</a>
            </div>
          </div>
          <div className="text-center md:text-left text-white/40 text-sm">
            © {new Date().getFullYear()} American Dream Lawn Care Services. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
