import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChatWidget } from '@/components/chat/chat-widget';
import { ArrowRight, Users, FileText, Calendar, TrendingUp, GraduationCap, Star, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
              HRManager++
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-32 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-slideUp">
                <h1 className="text-6xl font-bold leading-tight">
                  Transform Your HR Operations with{' '}
                  <span className="text-accent">AI-Powered</span> Solutions
                </h1>
                <p className="text-xl opacity-90">
                  Streamline employee management, automate workflows, and make data-driven decisions with our comprehensive HR platform.
                </p>
                <div className="flex space-x-4">
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-white gap-2">
                      Start Free Trial <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
                      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64&q=80",
                      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
                    ].map((src, i) => (
                      <Image
                        key={i}
                        src={src}
                        alt={`User ${i + 1}`}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <p className="text-sm">
                    Trusted by <span className="font-bold">10,000+</span> companies worldwide
                  </p>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/20 rounded-full filter blur-3xl"></div>
                <div className="relative animate-float">
                  <Image
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
                    alt="Dashboard Preview"
                    width={800}
                    height={600}
                    className="rounded-2xl shadow-2xl border border-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 section-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-primary font-semibold">Features</span>
              <h2 className="text-4xl font-bold mt-2 mb-6">
                Everything You Need to Manage HR
              </h2>
              <p className="text-xl text-muted-foreground">
                Powerful features to help you manage your workforce efficiently
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="Employee Management"
                description="Efficiently manage employee data, contracts, and documentation in one central location."
              />
              <FeatureCard
                icon={<FileText className="h-8 w-8" />}
                title="Contract Management"
                description="Track and manage employment contracts with automated expiration alerts."
              />
              <FeatureCard
                icon={<Calendar className="h-8 w-8" />}
                title="Leave Management"
                description="Streamline leave requests and approvals with real-time status tracking."
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8" />}
                title="Performance Tracking"
                description="Conduct evaluations and track employee performance over time."
              />
              <FeatureCard
                icon={<GraduationCap className="h-8 w-8" />}
                title="Training Programs"
                description="Manage employee training and development with progress tracking."
              />
              <FeatureCard
                icon={<Star className="h-8 w-8" />}
                title="Analytics & Reports"
                description="Generate insights with comprehensive HR analytics and reporting."
              />
            </div>
          </div>
        </section>

        {/* Image Grid Section */}
        <section className="py-24 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-primary font-semibold">Our Platform</span>
              <h2 className="text-4xl font-bold mt-2">
                Designed for Modern HR Teams
              </h2>
            </div>
            <div className="image-grid">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                alt="HR Dashboard"
                width={400}
                height={300}
                className="rounded-xl shadow-lg"
              />
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Team Meeting"
                width={400}
                height={300}
                className="rounded-xl shadow-lg"
              />
              <Image
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80"
                alt="Data Analytics"
                width={400}
                height={300}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-primary font-semibold">Testimonials</span>
              <h2 className="text-4xl font-bold mt-2">
                Trusted by Industry Leaders
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="hero-gradient text-white py-32 relative">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Transform Your HR Management?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of companies using HRManager++ to streamline their HR operations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Link href="/auth/register" className="w-full">
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-white gap-2">
                  Get Started Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features" className="w-full">
                <Button size="lg" variant="outline" className="w-full bg-white/10 hover:bg-white/20 border-white/20">
                  View Features
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/20 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">HRManager++</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern HR management solution for forward-thinking businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Case Studies</li>
                <li>Reviews</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 HRManager++. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <div style={{zIndex:99}}>
        <ChatWidget/>
      </div>
      
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="feature-card p-8 rounded-xl">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function TestimonialCard({ name, role, company, image, content }: {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
}) {
  return (
    <div className="testimonial-card bg-card/50 p-8 rounded-xl shadow-lg border border-primary/10">
      <div className="flex items-center space-x-4 mb-6">
        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className="rounded-full border-2 border-primary/20"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role} at {company}</p>
        </div>
      </div>
      <p className="text-muted-foreground italic">{content}</p>
      <div className="mt-6 flex items-center text-primary">
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "HR Director",
    company: "TechCorp",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    content: "HRManager++ has transformed how we handle HR operations. The automation and insights have saved us countless hours."
  },
  {
    name: "Michael Chen",
    role: "CEO",
    company: "InnovateLabs",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
    content: "The analytics and reporting features have given us valuable insights into our workforce management."
  },
  {
    name: "Emily Rodriguez",
    role: "HR Manager",
    company: "GlobalTech",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
    content: "The user interface is intuitive, and the support team is exceptional. Highly recommended for any growing company."
  }
];