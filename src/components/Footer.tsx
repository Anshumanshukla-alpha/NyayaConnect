import React from 'react';
import { Scale, ShieldCheck, HeartHandshake } from 'lucide-react';

interface FooterProps { onNavigate: (tab: string) => void; }

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => (
  <footer className="bg-[#172033] text-slate-400 text-xs border-t border-[#273247] mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#273247]">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-white font-serif font-semibold text-lg"><Scale className="w-5 h-5 text-[#d6b56d]" /><span>NyayaConnect</span></div>
          <p className="max-w-md text-slate-400 leading-relaxed text-xs">A secure digital platform for finding verified advocates, booking consultations, organizing case information and managing legal documents.</p>
          <div className="text-[11px] text-[#d6b56d]/90 font-medium">From legal problem to informed legal action.</div>
        </div>
        <div className="space-y-2">
          <span className="text-white font-semibold text-xs uppercase tracking-wider block">Services</span>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate('triage')} className="hover:text-white">Legal help</button></li>
            <li><button onClick={() => onNavigate('lawyers')} className="hover:text-white">Find a lawyer</button></li>
            <li><button onClick={() => onNavigate('appointments')} className="hover:text-white">Consultations</button></li>
            <li><button onClick={() => onNavigate('cases')} className="hover:text-white">Case workspace</button></li>
          </ul>
        </div>
        <div className="space-y-2">
          <span className="text-white font-semibold text-xs uppercase tracking-wider block">Support</span>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate('legal-aid')} className="hover:text-white">Legal aid</button></li>
            <li><button onClick={() => onNavigate('tracking')} className="hover:text-white">Case tracking</button></li>
            <li><a href="https://nalsa.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">NALSA · 15100</a></li>
            <li><button onClick={() => onNavigate('profile')} className="hover:text-white">Account & security</button></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>© 2026 NyayaConnect. Legal information is organized for convenience; final legal advice remains with your advocate.</div>
        <div className="flex items-center gap-2 text-emerald-400"><ShieldCheck className="w-3.5 h-3.5" /><span>Privacy & security focused</span></div>
      </div>
    </div>
  </footer>
);
