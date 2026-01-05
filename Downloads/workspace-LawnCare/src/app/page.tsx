'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, Star, Quote, Phone, Mail, MapPin, Scissors, Sprout, Sun, TreePine, Droplets, Tractor, Menu, X, Calendar, Clock, Award, Shield } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                American Dream Lawn
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                Services
              </a>
              <a href="#reviews" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                Reviews
              </a>
              <a href="#service-area" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                Service Area
              </a>
              <a href="#contact" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Button className="hidden md:inline-flex bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                Get Free Quote
              </Button>
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t">
              <a href="#services" className="block text-sm font-medium text-slate-700 hover:text-emerald-600">
                Services
              </a>
              <a href="#reviews" className="block text-sm font-medium text-slate-700 hover:text-emerald-600">
                Reviews
              </a>
              <a href="#service-area" className="block text-sm font-medium text-slate-700 hover:text-emerald-600">
                Service Area
              </a>
              <a href="#contact" className="block text-sm font-medium text-slate-700 hover:text-emerald-600">
                Contact
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600">
                  Get Free Quote
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="absolute inset-0 bg-grid-slate-200/[0.5] -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-50/50 -z-10"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-8">

              {/* Left Column: Text */}
              <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                <Badge className="mb-6 bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0 text-base px-4 py-2">
                  <Star className="h-4 w-4 mr-1 fill-white" />
                  5.0 Rating · 14 Reviews
                </Badge>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                  Your Dream Lawn{' '}
                  <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                    Starts Here
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
                  Professional lawn care services in Riverview, Florida. We transform ordinary yards into extraordinary outdoor spaces with expert care and attention to detail.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-base px-8 py-6 shadow-lg shadow-emerald-500/25">
                    Get Your Free Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 py-6 border-2">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Us Now
                  </Button>
                </div>
              </div>

              {/* Right Column: Image */}
              <div className="relative hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-700 border-4 border-white">
                  <Image
                    src="/images/hero-lawn-house.jpg"
                    alt="Beautiful home with perfectly manicured lawn"
                    width={800}
                    height={600}
                    className="object-cover w-full h-full scale-105 hover:scale-110 transition-transform duration-700"
                    priority
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-emerald-100 flex items-center gap-3 animate-bounce duration-[3000ms]">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Check className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Satisfaction Guaranteed</p>
                    <p className="text-xs text-slate-500">Or we re-do it for free</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">14+</div>
                <div className="text-sm text-slate-600 mt-1">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">5.0</div>
                <div className="text-sm text-slate-600 mt-1">Star Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">100%</div>
                <div className="text-sm text-slate-600 mt-1">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">Local</div>
                <div className="text-sm text-slate-600 mt-1">Family Owned</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                Our Services
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Complete Lawn Care Solutions
              </h2>
              <p className="text-lg text-slate-600">
                From regular maintenance to complete transformations, we offer everything your lawn needs to thrive and look its best.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-emerald-200">
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Scissors className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Lawn Mowing</CardTitle>
                  <CardDescription className="text-base">
                    Professional mowing with precise cutting, edging, and trimming for a manicured look every time.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-200">
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sprout className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Landscape Design</CardTitle>
                  <CardDescription className="text-base">
                    Transform your outdoor space with custom landscaping, plants, trees, and beautiful hardscaping.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-emerald-200">
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TreePine className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Tree & Shrub Care</CardTitle>
                  <CardDescription className="text-base">
                    Expert pruning, shaping, and maintenance to keep your trees and shrubs healthy and beautiful.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-200">
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Droplets className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Irrigation Services</CardTitle>
                  <CardDescription className="text-base">
                    Efficient irrigation system installation, repair, and maintenance for optimal water management.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-emerald-200">
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Tractor className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Aeration & Fertilization</CardTitle>
                  <CardDescription className="text-base">
                    Core aeration and premium fertilization programs for thicker, greener, healthier grass.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-200">
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sun className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">Seasonal Clean-Up</CardTitle>
                  <CardDescription className="text-base">
                    Spring and fall clean-up services including leaf removal, debris clearing, and bed preparation.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Why Choose Us */}
            <div className="mt-12 relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/grass-texture.jpg"
                  alt="Grass texture"
                  fill
                  className="object-cover opacity-20 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-800 opacity-95"></div>
              </div>

              <div className="relative z-10 p-8 md:p-12 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Choose American Dream Lawn Care?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <div className="h-16 w-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-lg">
                      <Award className="h-8 w-8" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">5-Star Service</h4>
                    <p className="text-emerald-100 text-sm">
                      Every customer receives our highest level of care and attention to detail.
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <div className="h-16 w-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-lg">
                      <Shield className="h-8 w-8" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Fully Insured</h4>
                    <p className="text-emerald-100 text-sm">
                      Professional and fully insured for your peace of mind.
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                    <div className="h-16 w-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-lg">
                      <Clock className="h-8 w-8" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Reliable Service</h4>
                    <p className="text-emerald-100 text-sm">
                      On-time, every time. Your satisfaction is our priority.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <div className="mt-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <div className="p-8 md:p-12 text-center">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
              See Us In Action
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900">Transformation Gallery</h3>

            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border-4 border-slate-100 bg-slate-100 group">
              {/* Placeholder Video using a reliable public domain source */}
              <video
                className="w-full h-full object-cover"
                controls={true}
                poster="/images/hero-lawn-house.jpg"
                preload="none"
              >
                <source src="https://videos.pexels.com/video-files/4206371/4206371-hd_1920_1080_30fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Overlay Play Button (Optional - video has native controls) */}
              {/* <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
                     <div className="bg-white/90 p-4 rounded-full shadow-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                       <Play className="h-8 w-8 text-emerald-600 ml-1" />
                     </div>
                   </div> */}
            </div>
            <p className="mt-6 text-slate-600">
              Watch how we transform overgrown yards into beautiful outdoor living spaces.
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <section id="reviews" className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
                ⭐ Customer Reviews
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                What Our Neighbors Say
              </h2>
              <p className="text-lg text-slate-600">
                Proudly serving Riverview, Florida with 5.0 star rated service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <Card className="relative bg-white border-2">
                <CardHeader>
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-emerald-200" />
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base text-slate-700 italic leading-relaxed">
                    "Amazing service! My lawn has never looked better. They show up on time, are very professional, and truly care about their work. Highly recommend!"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                      JM
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Jennifer M.</div>
                      <div className="text-sm text-slate-600">Riverview, FL</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative bg-white border-2">
                <CardHeader>
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-green-200" />
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base text-slate-700 italic leading-relaxed">
                    "Best lawn care service in Riverview! They transformed our yard from a mess to a beautiful oasis. Fair prices and excellent communication."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                      RD
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Robert D.</div>
                      <div className="text-sm text-slate-600">Riverview, FL</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative bg-white border-2">
                <CardHeader>
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-emerald-200" />
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base text-slate-700 italic leading-relaxed">
                    "Finally found a lawn care company I can trust! They're professional, reliable, and my yard looks fantastic every single week. 5 stars!"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                      SW
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Sarah W.</div>
                      <div className="text-sm text-slate-600">Riverview, FL</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Service Area Section */}
        <section id="service-area" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                  Service Area
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  Proudly Serving Riverview, Florida
                </h2>
                <p className="text-lg text-slate-600">
                  Your trusted local lawn care experts serving the greater Riverview area
                </p>
              </div>

              <Card className="border-2 shadow-xl">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-emerald-600" />
                        Our Location
                      </h3>
                      <p className="text-slate-600 mb-4">
                        The American Dream Lawn Care Services is proud to serve homeowners and businesses throughout Riverview, Florida and surrounding areas.
                      </p>
                      <div className="space-y-3 text-slate-700">
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>Riverview, FL</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>Surrounding Hillsborough County areas</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>Residential & Commercial properties</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg">Service Hours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Monday - Friday</span>
                            <span className="font-semibold">7:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Saturday</span>
                            <span className="font-semibold">8:00 AM - 4:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Sunday</span>
                            <span className="font-semibold">Closed</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Flexible Scheduling
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-700">
                            We work around your schedule. Weekly, bi-weekly, and monthly service options available.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
              <div>
                <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                  Get In Touch
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                  Your Dream Lawn Awaits
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Ready to transform your lawn? Contact us today for a free quote and discover why Riverview residents trust American Dream Lawn Care Services.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Phone</div>
                      <a href="tel:+18135551234" className="text-emerald-600 hover:text-emerald-700 transition-colors text-lg">
                        (813) 555-1234
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Email</div>
                      <a href="mailto:info@americandreamlawncare.com" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                        info@americandreamlawncare.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Service Area</div>
                      <div className="text-slate-700">
                        Riverview, FL<br />
                        Hillsborough County
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-base px-6 py-4 shadow-lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="border-2 text-base px-6 py-4">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Service
                  </Button>
                </div>
              </div>

              <Card className="border-2 shadow-xl">
                <CardHeader>
                  <CardTitle>Request a Free Quote</CardTitle>
                  <CardDescription>Fill out the form and we'll get back to you within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                          First Name *
                        </label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                          Last Name *
                        </label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                        Phone Number *
                      </label>
                      <Input id="phone" type="tel" placeholder="(813) 555-1234" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="service" className="text-sm font-medium text-slate-700">
                        Service Needed *
                      </label>
                      <select id="service" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Select a service</option>
                        <option value="mowing">Lawn Mowing</option>
                        <option value="landscaping">Landscaping</option>
                        <option value="tree-care">Tree & Shrub Care</option>
                        <option value="irrigation">Irrigation Services</option>
                        <option value="aeration">Aeration & Fertilization</option>
                        <option value="cleanup">Seasonal Clean-Up</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-slate-700">
                        Message
                      </label>
                      <Textarea id="message" placeholder="Tell us about your lawn care needs..." className="min-h-[120px]" />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                      Get Free Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-white border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">American Dream Lawn</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Professional lawn care services in Riverview, Florida. Transforming ordinary yards into extraordinary outdoor spaces.
              </p>
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0">
                <Star className="h-3 w-3 mr-1 fill-white" />
                5.0 Rating
              </Badge>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-3">
                <li><a href="#services" className="text-slate-400 hover:text-white transition-colors text-sm">Lawn Mowing</a></li>
                <li><a href="#services" className="text-slate-400 hover:text-white transition-colors text-sm">Landscaping</a></li>
                <li><a href="#services" className="text-slate-400 hover:text-white transition-colors text-sm">Tree & Shrub Care</a></li>
                <li><a href="#services" className="text-slate-400 hover:text-white transition-colors text-sm">Irrigation</a></li>
              </ul>
            </div>

            {/* Service Area */}
            <div>
              <h3 className="font-semibold text-white mb-4">Service Area</h3>
              <ul className="space-y-3">
                <li><a href="#service-area" className="text-slate-400 hover:text-white transition-colors text-sm">Riverview, FL</a></li>
                <li><a href="#service-area" className="text-slate-400 hover:text-white transition-colors text-sm">Hillsborough County</a></li>
                <li><a href="#service-area" className="text-slate-400 hover:text-white transition-colors text-sm">Residential</a></li>
                <li><a href="#service-area" className="text-slate-400 hover:text-white transition-colors text-sm">Commercial</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <a href="tel:+18135551234" className="text-slate-400 hover:text-white transition-colors text-sm">(813) 555-1234</a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <a href="mailto:info@americandreamlawncare.com" className="text-slate-400 hover:text-white transition-colors text-sm">info@americandreamlawncare.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-400 text-sm">Riverview, FL</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm text-center md:text-left">
                © 2024 The American Dream Lawn Care Services. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
