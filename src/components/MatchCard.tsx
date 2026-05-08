import { Match } from '../types';
import { Activity, Trophy, Clock, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: Match;
  teamAName: string;
  teamBName: string;
}

export default function MatchCard({ match, teamAName, teamBName }: MatchCardProps) {
  const isLive = match.status === 'live';
  
  return (
    <Link to={`/match/${match.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className={`glass-card p-6 overflow-hidden relative group transition-all hover:border-blue-500/30 ${isLive ? 'ring-1 ring-blue-500/20' : ''}`}
      >
        {isLive && (
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6 font-mono uppercase tracking-widest grayscale group-hover:grayscale-0 transition-all">
          <Activity className="w-3 h-3 text-blue-400" />
          <span>{match.venue || 'Local Ground'}</span>
          <span>•</span>
          <span>{match.format || 'T20'}</span>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-colors">
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <span className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight italic">{teamAName}</span>
            </div>
            {match.liveData && (
              <div className="text-right">
                <div className="text-xl font-black text-white">{match.liveData.innnings[0]?.score || 0}/{match.liveData.innnings[0]?.wickets || 0}</div>
                <div className="text-[10px] text-slate-500 font-mono italic">({match.liveData.innnings[0]?.overs || 0} OV)</div>
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center py-2">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
             <div className="relative px-3 bg-[#0c1222] border border-white/5 rounded-md text-[9px] font-black italic text-slate-600 uppercase tracking-tighter">VS</div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-colors">
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <span className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight italic">{teamBName}</span>
            </div>
            {match.liveData && match.liveData.currentInning > 1 && (
              <div className="text-right">
                <div className="text-xl font-black text-white">{match.liveData.innnings[1]?.score || 0}/{match.liveData.innnings[1]?.wickets || 0}</div>
                <div className="text-[10px] text-slate-500 font-mono italic">({match.liveData.innnings[1]?.overs || 0} OV)</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
           <div className="flex items-center text-[9px] text-slate-500 space-x-2 uppercase font-bold tracking-widest">
              <Clock className="w-3 h-3 text-blue-500" />
              <span>{match.status === 'upcoming' ? 'Starts soon' : match.status === 'completed' ? 'Match Finished' : 'Match in progress'}</span>
           </div>
           <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors" />
        </div>
      </motion.div>
    </Link>
  );
}

function ChevronRight(props: any) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
