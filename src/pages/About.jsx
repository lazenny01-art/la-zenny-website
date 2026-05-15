import { Link } from 'react-router-dom';
import { Heart, Sparkles, MapPin, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-[#111111] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/seed/about-hero/1400/600" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#F9C4D2] tracking-widest uppercase text-sm font-semibold mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">Born from Passion.<br />Built for You.</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            LA ZENNY — THE FASHION is a celebration of modern Indian womanhood — bold, beautiful, and unapologetically her.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <p className="section-subtitle text-[#F4A5BE]">Who We Are</p>
            <h2 className="section-title">Fashion That Tells Your Story</h2>
            <p className="text-gray-600 leading-relaxed">
              We started LA ZENNY with one dream: to create a fashion brand that truly understands the modern Indian woman.
              From vibrant prints to feminine silhouettes — every piece in our collection is handpicked with love.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that fashion is more than clothing — it's an expression, a mood, a moment captured in fabric.
              That's why every drop is curated to make you feel confident, beautiful, and effortlessly you.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                { icon: Heart, label: 'Curated with Love' },
                { icon: Award, label: 'Premium Quality' },
                { icon: MapPin, label: 'Made in India' },
                { icon: Sparkles, label: 'Trend-Forward' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-[#FDE8EF] px-4 py-2 rounded-full text-sm font-medium text-[#111111]">
                  <Icon size={14} className="text-[#F4A5BE]" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://picsum.photos/seed/about1/400/500" alt="About 1" className="rounded-2xl object-cover w-full h-full shadow-lg" />
            <img src="https://picsum.photos/seed/about2/400/500" alt="About 2" className="rounded-2xl object-cover w-full h-full shadow-lg mt-8" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#FDE8EF] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="section-subtitle text-[#F4A5BE] mb-2">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Style for Every Body',
                desc: 'We design for all body types. Our extended size range ensures everyone can feel fabulous.',
                emoji: '🌸',
              },
              {
                title: 'Affordable Luxury',
                desc: 'Premium fashion doesn\'t need to break the bank. We bring you trend-forward pieces at honest prices.',
                emoji: '✨',
              },
              {
                title: 'Always On-Trend',
                desc: 'Our team scouts global trends and delivers them fresh — fast fashion done right.',
                emoji: '🚀',
              },
            ].map((val, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <p className="text-4xl mb-4">{val.emoji}</p>
                <h3 className="font-bold text-lg mb-3 text-[#111111]">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h3 className="font-display text-3xl font-bold mb-4">Ready to Find Your Style?</h3>
        <p className="text-gray-500 mb-8">Explore our latest collection and find your next favourite outfit.</p>
        <Link to="/shop" className="btn-primary">Shop Now</Link>
      </section>
    </div>
  );
}
