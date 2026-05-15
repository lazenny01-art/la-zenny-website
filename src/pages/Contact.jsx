import { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#FDE8EF] to-white py-16 text-center">
        <p className="section-subtitle text-[#F4A5BE] mb-3">Get in Touch</p>
        <h1 className="section-title text-4xl md:text-5xl">We'd Love to Hear From You</h1>
        <p className="text-gray-500 mt-4 max-w-md mx-auto">For orders, styling advice, or just to say hello — we're here for you!</p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-bold text-2xl text-[#111111] mb-6">Contact Details</h2>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Call / WhatsApp', value: '+91 99999 99999' },
                  { icon: Mail, label: 'Email', value: 'lazenny@fashion.in' },
                  { icon: MapPin, label: 'Location', value: 'India 🇮🇳' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-[#FDE8EF] rounded-full flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#F4A5BE]" />
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase font-semibold text-gray-400 mb-0.5">{label}</p>
                      <p className="font-medium text-[#111111]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-[#111111] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Chat on WhatsApp</h3>
              <p className="text-gray-400 text-sm mb-4">Get instant help for orders, sizing, returns & more. We reply within minutes!</p>
              <a
                href="https://wa.me/919999999999?text=Hi%20LA%20ZENNY!%20I%20have%20a%20question."
                id="contact-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 font-semibold rounded-full transition-colors text-sm"
              >
                <MessageCircle size={18} />
                WhatsApp Now
              </a>
            </div>

            {/* Business Hours */}
            <div className="border border-gray-100 rounded-2xl p-6">
              <h3 className="font-semibold text-[#111111] mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Monday – Saturday</span>
                  <span className="font-semibold">10 AM – 8 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">11 AM – 6 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="font-bold text-xl text-[#111111] mb-6">Send Us a Message</h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="font-bold text-lg text-[#111111] mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We'll get back to you within 24 hours. 💕</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-gray-500 mb-1.5">Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F9C4D2] transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-gray-500 mb-1.5">Phone</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F9C4D2] transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-gray-500 mb-1.5">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F9C4D2] transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-gray-500 mb-1.5">Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#F9C4D2] transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  id="contact-submit"
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
