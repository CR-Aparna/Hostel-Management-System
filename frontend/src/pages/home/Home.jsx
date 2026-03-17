import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Wrench, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          Hostel<span className="text-indigo-600">Hub</span>
        </div>
        <Link to="/login" className="bg-white text-slate-700 px-5 py-2 rounded-full font-semibold border border-slate-200 hover:border-indigo-600 transition-all shadow-sm">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
            Redefining the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Hostel Experience
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            A centralized digital ecosystem for students and management. Handle payments, maintenance, and allocations with a single tap.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
              Go to Dashboard <ChevronRight size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Abstract Visual / Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-indigo-100 to-violet-100 h-96 rounded-3xl overflow-hidden shadow-inner border border-white"
        >
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-64 h-40 bg-white rounded-2xl shadow-2xl p-6 transform -rotate-12 border border-slate-100">
                <div className="h-4 w-20 bg-indigo-100 rounded mb-4" />
                <div className="h-2 w-full bg-slate-50 rounded mb-2" />
                <div className="h-2 w-3/4 bg-slate-50 rounded" />
             </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Platform Features</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Feature icon={<CreditCard className="text-indigo-600" />} title="Smart Billing" desc="Automated invoice generation and easy online payment tracking." />
            <Feature icon={<Wrench className="text-violet-600" />} title="Maintenance Desk" desc="Track repair requests from complaint to resolution in real-time." />
            <Feature icon={<Shield className="text-blue-600" />} title="Admin Portal" desc="Grant approvals and manage escalations with total transparency." />
          </div>
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all"
  >
    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Home;