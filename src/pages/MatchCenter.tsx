import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Match } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Users, Clock, Share2, Info, List, MessageSquare, BarChart3, ChevronDown } from 'lucide-react';
import ScoringPanel from '../components/scoring/ScoringPanel';
import { useAuth } from '../hooks/useAuth';

export default function MatchCenter() {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [activeTab, setActiveTab] = useState<'scorecard' | 'commentary' | 'stats' | 'scoring'>('scorecard');
  const { profile } = useAuth();

  useEffect(() => {
    if (!matchId) return;
    const unsubscribe = onSnapshot(doc(db, 'matches', matchId), (doc) => {
      setMatch({ id: doc.id, ...doc.data() } as Match);
    });
    return () => unsubscribe();
  }, [matchId]);

  if (!match) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading Match Data...</div>;

  const currentInning = match.liveData?.innnings[match.liveData.currentInning - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Match Header */}
      <div className="glass-card mb-8 overflow-hidden relative">
        <div className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
               <div className="badge-live scale-90">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  LIVE
               </div>
               <span>•</span>
               <span>{match.venue || 'Stadium'}</span>
               <span>•</span>
               <span>{match.format || 'T20'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded border border-blue-600/30 font-semibold">MATCH ID: #{match.id?.slice(-8).toUpperCase()}</div>
              <button className="text-slate-400 hover:text-white transition-colors">
                 <Share2 className="w-4 h-4" />
              </button>
            </div>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent -z-10" />
           <div className="flex flex-col items-center md:items-start">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mb-6 group transition-all hover:rotate-3">
                 <Users className="w-10 h-10 text-slate-400 group-hover:text-blue-400" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Team Alpha</div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">{match.teamAId}</h2>
              {match.liveData?.currentInning === 1 && (
                <div className="flex flex-col">
                   <div className="text-5xl font-black text-white italic tracking-tighter leading-none">
                      {currentInning?.score}<span className="text-blue-500">/</span>{currentInning?.wickets} 
                   </div>
                   <div className="mt-2 text-xs text-slate-500 uppercase tracking-widest font-black italic">
                     {currentInning?.overs} / {match.settings.overs} <span className="text-blue-400 ml-2">Overs</span>
                   </div>
                </div>
              )}
           </div>

           <div className="flex flex-col items-center text-center py-6 px-8 glass-card border-white/5 bg-white/5 backdrop-blur-sm">
              <div className="text-[10px] font-black tracking-[0.4em] text-slate-600 mb-4 uppercase">Match Synopsis</div>
              <div className="text-sm font-bold text-slate-200 py-3 px-6 glass-card border-white/10 italic leading-snug">
                 {match.resultNote || 'The battle for supremacy continues...'}
              </div>
              {match.status === 'live' && (
                 <div className="mt-6 flex flex-col gap-1 items-center">
                    <div className="text-[10px] font-black text-blue-500/80 uppercase tracking-widest">Run Rate</div>
                    <div className="text-2xl font-black text-white italic">
                       {((currentInning?.score || 0) / (parseFloat(currentInning?.overs.toString() || '0') || 1)).toFixed(2)}
                    </div>
                 </div>
              )}
           </div>

           <div className="flex flex-col items-center md:items-end">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mb-6 group transition-all hover:-rotate-3 text-right">
                 <Users className="w-10 h-10 text-slate-400 group-hover:text-blue-400" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold text-right w-full">Team Bravo</div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter text-right leading-none mb-4">{match.teamBId}</h2>
              {match.liveData?.currentInning === 2 && (
                <div className="flex flex-col items-end">
                   <div className="text-5xl font-black text-white italic tracking-tighter leading-none text-right">
                      {currentInning?.score}<span className="text-blue-500">/</span>{currentInning?.wickets} 
                   </div>
                   <div className="mt-2 text-xs text-slate-500 uppercase tracking-widest font-black italic text-right">
                      {currentInning?.overs} / {match.settings.overs} <span className="text-blue-400 ml-2">Overs</span>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
         {[
           { id: 'scorecard', name: 'Scorecard', icon: List },
           { id: 'commentary', name: 'Commentary', icon: MessageSquare },
           { id: 'stats', name: 'Analysis', icon: BarChart3 },
           ...(profile?.uid === match.scorerId || profile?.role === 'admin' ? [{ id: 'scoring', name: 'Scorer Panel', icon: Activity }] : [])
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex items-center space-x-2 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-b-2 ${
               activeTab === tab.id ? 'text-blue-500 border-blue-500 bg-blue-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'
             }`}
           >
             <tab.icon className="w-4 h-4" />
             <span>{tab.name}</span>
           </button>
         ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
              {activeTab === 'scorecard' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                   <div className="glass-card overflow-hidden">
                      <div className="p-4 bg-slate-900 flex justify-between items-center border-b border-slate-800">
                         <h3 className="font-bold uppercase text-xs text-slate-400 tracking-widest flex items-center">
                            <Info className="w-3 h-3 mr-2" />
                            Scorecard
                         </h3>
                         <button className="text-[10px] uppercase font-black text-blue-400 hover:text-blue-300 tracking-widest transition-colors mb-0.5">
                            Switch Inning
                         </button>
                      </div>
                      <div className="p-0">
                         <table className="w-full text-left text-sm">
                            <thead className="bg-slate-950/50 text-slate-500 uppercase text-[10px] font-black letter border-b border-slate-800">
                               <tr>
                                  <th className="px-6 py-4">Batter</th>
                                  <th className="px-4 py-4 text-center">R</th>
                                  <th className="px-4 py-4 text-center">B</th>
                                  <th className="px-4 py-4 text-center">4s</th>
                                  <th className="px-4 py-4 text-center">6s</th>
                                  <th className="px-4 py-4 text-center">SR</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50 text-slate-300">
                               <tr className="bg-blue-500/5">
                                  <td className="px-6 py-4 font-bold text-white flex items-center italic">
                                     <Star className="w-3 h-3 text-orange-500 mr-2 fill-current" />
                                     {match.liveData?.strikerId}
                                  </td>
                                  <td className="px-4 py-4 text-center font-bold text-white">42</td>
                                  <td className="px-4 py-4 text-center text-slate-500">28</td>
                                  <td className="px-4 py-4 text-center">5</td>
                                  <td className="px-4 py-4 text-center text-orange-500/80">2</td>
                                  <td className="px-4 py-4 text-center font-mono text-slate-400">150.0</td>
                               </tr>
                               <tr>
                                  <td className="px-6 py-4 font-bold uppercase">{match.liveData?.nonStrikerId}</td>
                                  <td className="px-4 py-4 text-center font-bold text-white">12</td>
                                  <td className="px-4 py-4 text-center text-slate-500">10</td>
                                  <td className="px-4 py-4 text-center">1</td>
                                  <td className="px-4 py-4 text-center">0</td>
                                  <td className="px-4 py-4 text-center font-mono text-slate-400">120.0</td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                   </div>
                   
                   <div className="glass-card mt-8 p-6">
                      <h4 className="text-[10px] font-black uppercase text-slate-600 mb-4 tracking-widest">Fall of Wickets</h4>
                      <div className="flex flex-wrap gap-3">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
                              <span className="text-rose-500 font-bold">{i}-24</span>
                              <span className="text-slate-600 ml-2">(Over 3.4)</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'scoring' && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <ScoringPanel match={match} />
                 </motion.div>
              )}
              
              {activeTab === 'commentary' && (
                <div className="space-y-4">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="glass-card p-4 flex space-x-4 border-l-4 border-l-blue-500 bg-white/5 backdrop-blur-sm">
                        <div className="text-lg font-black text-slate-500 font-mono italic">{(5 - i).toFixed(1)}</div>
                        <div>
                           <p className="text-slate-200">
                              <span className="font-bold text-white uppercase italic tracking-widest">4 RUNS!</span> {match.liveData?.strikerId} smashes it over mid-wicket for a boundary. What a shot!
                           </p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="glass-card p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center">
                 <Users className="w-4 h-4 mr-2" />
                 Current Partners
              </h3>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xl font-bold text-white">45 <span className="text-slate-600 text-xs">(32)</span></span>
                 <span className="text-xs text-orange-500 font-bold uppercase">5.1 RR</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                 <div className="bg-orange-600 h-full w-[65%]" />
                 <div className="bg-slate-700 h-full w-[35%]" />
              </div>
           </div>

           <div className="glass-card p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Recent Over</h3>
              <div className="flex space-x-2">
                 {['WD', '1', '0', '4', 'W', '6'].map((ball, i) => (
                   <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border ${
                     ball === 'W' ? 'bg-rose-500 border-rose-400 text-white' : 
                     ball === '4' || ball === '6' ? 'bg-orange-500 border-orange-400 text-white' :
                     'bg-slate-800 border-slate-700 text-slate-300'
                   }`}>
                      {ball}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
