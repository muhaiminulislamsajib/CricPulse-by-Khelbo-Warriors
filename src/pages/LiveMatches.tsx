import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Match } from '../types';
import MatchCard from '../components/MatchCard';
import { motion } from 'motion/react';
import { Activity, Search, Filter } from 'lucide-react';

export default function LiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'matches'),
      where('status', 'in', ['live', 'upcoming'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Match[];
      setMatches(matchesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase italic">
            Live <span className="text-orange-500">Center</span>
          </h1>
          <p className="text-slate-400">Ongoing matches and upcoming fixtures from around the world.</p>
        </div>

        <div className="flex w-full md:w-auto space-x-2">
           <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search matches..." 
                className="input-field w-full pl-10"
              />
           </div>
           <button className="glass-button p-2 text-slate-400">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-64 animate-pulse bg-slate-900/50" />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {matches.map(match => (
            <MatchCard 
              key={match.id} 
              match={match} 
              teamAName={match.teamAId} // In real app, we'd fetch team names
              teamBName={match.teamBId} 
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-24 glass-card border-dashed">
          <Activity className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-500">No matches are live right now</h3>
          <p className="text-slate-600">Check back later or browse upcoming tournaments.</p>
        </div>
      )}
    </div>
  );
}
