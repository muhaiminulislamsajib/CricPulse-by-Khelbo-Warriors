import { Match, BallData } from '../../types';
import { useScoring } from '../../hooks/useScoring';
import { motion } from 'motion/react';
import { User, AlertCircle, RotateCcw, Save, Hash } from 'lucide-react';

interface ScoringPanelProps {
  match: Match;
}

export default function ScoringPanel({ match }: ScoringPanelProps) {
  const { recordBall, loading } = useScoring(match);
  const liveData = match.liveData;

  if (!liveData) return null;

  const runOptions = [0, 1, 2, 3, 4, 6];
  const extraOptions: { label: string, type: BallData['extrasType'] }[] = [
    { label: 'WD', type: 'wide' },
    { label: 'NB', type: 'noball' },
    { label: 'LB', type: 'legbye' },
    { label: 'BYE', type: 'bye' },
  ];

  return (
    <div className="glass-card p-6 flex flex-col h-full bg-white/5 backdrop-blur-xl border-white/5">
      {/* Current Batter Info */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-blue-600 rounded-2xl border border-blue-400 shadow-lg shadow-blue-900/20 group hover:scale-[1.02] transition-all">
          <div className="text-[9px] uppercase font-black text-blue-200 mb-1 flex items-center tracking-widest opacity-80">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Striker
          </div>
          <div className="text-xl font-bold text-white truncate uppercase italic leading-none">{liveData.strikerId}</div>
          <div className="text-[10px] text-blue-100 font-black tracking-widest uppercase mt-2 opacity-60">Professional Mode</div>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
           <div className="text-[9px] uppercase font-black text-slate-500 mb-1 tracking-widest">Non-Striker</div>
           <div className="text-xl font-bold text-slate-300 truncate uppercase italic leading-none">{liveData.nonStrikerId}</div>
           <div className="text-[10px] text-slate-600 font-black tracking-widest uppercase mt-2">Active Partnership</div>
        </div>
      </div>

      {/* Main Scoring Buttons */}
      <div className="flex-grow grid grid-cols-3 gap-3 mb-8">
        {runOptions.map((run) => (
          <motion.button
            key={run}
            whileTap={{ scale: 0.95 }}
            onClick={() => recordBall({ runs: run, extras: 0, extrasType: 'none' })}
            disabled={loading}
            className={`flex flex-col items-center justify-center p-6 border rounded-2xl transition-all group ${
              run === 4 ? 'bg-blue-600/80 hover:bg-blue-600 border-blue-500' :
              run === 6 ? 'bg-indigo-600/80 hover:bg-indigo-600 border-indigo-500' :
              'bg-white/5 hover:bg-white/10 border-white/10'
            }`}
          >
            <span className="text-4xl font-black text-white group-hover:scale-110 transition-transform italic">{run}</span>
            <span className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500 mt-2">Runs</span>
          </motion.button>
        ))}

        {extraOptions.map((extra) => (
          <motion.button
            key={extra.type}
            whileTap={{ scale: 0.95 }}
            onClick={() => recordBall({ runs: 0, extras: 1, extrasType: extra.type })}
            disabled={loading}
            className="flex flex-col items-center justify-center p-6 bg-orange-600/10 hover:bg-orange-600/20 border border-orange-500/20 rounded-2xl transition-all"
          >
            <span className="text-xl font-black text-orange-400 italic tracking-tighter">{extra.label}</span>
            <span className="text-[9px] uppercase font-black tracking-[0.2em] text-orange-600/60 mt-1">Extra</span>
          </motion.button>
        ))}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {/* Wicket Dialog */}}
          className="col-span-1 flex flex-col items-center justify-center p-6 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 rounded-2xl transition-all group"
        >
          <span className="text-xl font-black text-red-400 group-hover:scale-110 transition-transform italic tracking-tight">WICKET</span>
          <AlertCircle className="w-4 h-4 text-red-600 mt-1" />
        </motion.button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <button className="glass-button flex items-center justify-center py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
           <RotateCcw className="w-4 h-4 mr-2" />
           Undo Last Ball
        </button>
        <button className="glass-button flex items-center justify-center py-4 text-[10px] font-black uppercase tracking-widest text-white hover:border-blue-500 transition-all">
           <Save className="w-4 h-4 mr-2 text-blue-500" />
           End Innings
        </button>
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
