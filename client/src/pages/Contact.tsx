import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Instagram, Facebook } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      
      <main className="flex-1">
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 
              className="font-serif text-4xl md:text-5xl font-bold mb-4"
              data-testid="text-contact-title"
            >
              Get in Touch
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a question about our jewelry or want to inquire about custom pieces? 
              We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 
                className="font-serif text-2xl font-bold mb-6"
                data-testid="text-form-title"
              >
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-name"
                  />
                </div>
                
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    data-testid="input-message"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  data-testid="button-submit"
                >
                  Send Message
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div>
                <h2 
                  className="font-serif text-2xl font-bold mb-6"
                  data-testid="text-info-title"
                >
                  Contact Information
                </h2>
                
                <Card className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p 
                        className="text-sm text-muted-foreground"
                        data-testid="text-email"
                      >
                        hello@meyaarjewellers.com
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h3 
                  className="font-serif text-xl font-bold mb-4"
                  data-testid="text-social-title"
                >
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => console.log("Instagram clicked")}
                    data-testid="button-instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => console.log("Facebook clicked")}
                    data-testid="button-facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => console.log("Email clicked")}
                    data-testid="button-email"
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Card className="p-6 bg-muted/30">
                <h3 className="font-medium mb-2">Business Hours</h3>
                <p className="text-sm text-muted-foreground" data-testid="text-hours">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
