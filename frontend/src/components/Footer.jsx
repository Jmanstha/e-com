import {
  ShoppingBag,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-20 border-t"
      style={{ backgroundColor: "#f3ede4", borderColor: "#e8ddd4" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#c0694e" }}
              >
                <ShoppingBag size={12} className="text-white" />
              </div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: "#3d2b1f" }}
              >
                Yarnly
              </span>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Crafting premium, sustainable goods for those who appreciate the
              beauty of hand-knit artistry.
            </p>
            <div className="flex gap-4 text-stone-400">
              <a
                href="https://www.instagram.com/jaiman.stha/"
                className="hover:text-[#c0694e] transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://x.com/JaimanShrestha"
                className="hover:text-[#c0694e] transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.facebook.com/jaiman.shrestha.5"
                className="hover:text-[#c0694e] transition-colors"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-bold mb-4 text-sm uppercase tracking-widest"
              style={{ color: "#3d2b1f" }}
            >
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <a href="#" className="hover:text-[#c0694e]">
                  All Collections
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c0694e]">
                  Bestsellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c0694e]">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c0694e]">
                  Eco-Friendly Line
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="font-bold mb-4 text-sm uppercase tracking-widest"
              style={{ color: "#3d2b1f" }}
            >
              Support
            </h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <a href="#" className="hover:text-[#c0694e]">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c0694e]">
                  Return & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c0694e]">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c0694e]">
                  Care Instructions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-bold mb-4 text-sm uppercase tracking-widest"
              style={{ color: "#3d2b1f" }}
            >
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#c0694e]" />
                <span>jmanstha089@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#c0694e]" />
                <span>9741686722</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#c0694e] mt-0.5" />
                <span>
                  Dhungedhara
                  <br />
                  Kathmandu, Bg
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-200/60 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-stone-400 uppercase tracking-widest">
          <p>© 2026 Yarnly Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-stone-600">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
