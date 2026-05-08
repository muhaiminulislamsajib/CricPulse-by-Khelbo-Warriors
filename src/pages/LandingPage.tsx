import { motion } from 'motion/react';
import { Trophy, Activity, Users, ChevronRight, Play, Star, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-slate-900/50 border border-white/10 px-3 py-1 rounded-full mb-8 backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">New: Real-time NRR calculation engine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9]"
            >
              CRICKET SCORING <br />
              <span className="text-gradient">EVOLVED.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12"
            >
              The most advanced tournament management ecosystem. From box cricket to professional leagues, 
              live score like a pro with real-time stats and sharing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link to="/tournaments" className="primary-button text-lg px-8 py-4 w-full sm:w-auto">
                Host a Tournament
              </Link>
              <Link to="/live" className="glass-button text-lg px-8 py-4 flex items-center justify-center w-full sm:w-auto text-white">
                <Play className="w-5 h-5 mr-3 fill-current" />
                Watch Live
              </Link>
            </motion.div>
          </div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { label: 'Tournaments Hosted', value: '1.2k+', icon: Trophy },
              { label: 'Live Matches Daily', value: '450+', icon: Activity },
              { label: 'Active Players', value: '50k+', icon: Users },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-8 text-center group hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform border border-white/5">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-white mb-2 italic">{stat.value}</div>
                <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight uppercase italic tracking-tighter">
                Fully Customizable <br /> 
                <span className="text-blue-500">Cricket Logic</span>
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Street cricket rules? T20 matches? T10? We support them all. Configure wides, no-balls, wickets, 
                and even one-side batting matches with ease.
              </p>
              <ul className="space-y-4">
                {[
                  'One-side vs Two-side Batting Mode',
                  'Last Man Standing Rules',
                  'No-ball Run Customization',
                  'DLS Method & NRR Tracking',
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-200">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Star className="w-3 h-3 text-blue-500 fill-blue-500" />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="glass-card aspect-square p-2 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="glass-card aspect-[4/3] p-2 overflow-hidden bg-blue-600">
                   <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                      <Activity className="w-12 h-12 mb-4 relative z-10" />
                      <div className="text-xl font-black relative z-10 italic uppercase">100ms Sync</div>
                      <div className="text-[10px] uppercase font-bold tracking-widest relative z-10 opacity-80">Real-time stats</div>
                   </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="glass-card aspect-[3/4] p-2 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="glass-card aspect-square p-2 overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1624194642868-bb218ecf6d8d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 lg:p-24 text-center relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-indigo-900/40">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy className="w-64 h-64 text-white -rotate-12 translate-x-1/2 -translate-y-1/2" />
             </div>
             <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 italic uppercase tracking-tighter">Ready to start the next big league?</h2>
             <p className="text-slate-400 mb-12 text-lg max-w-2xl mx-auto font-medium">
               Join thousands of organizers using CricPulse to bring professional scoring to their local community.
             </p>
             <button className="primary-button text-xl px-12 py-5 uppercase tracking-tighter italic">
               Create Tournament Now
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}
