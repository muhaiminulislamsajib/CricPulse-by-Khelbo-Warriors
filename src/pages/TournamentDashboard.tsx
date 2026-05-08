import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Tournament, Team } from '../types';
import { Trophy, Plus, Users, Layout as LayoutIcon, ChevronRight, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function TournamentDashboard() {
  const { user, profile } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'create_tournament' | 'create_team'>('overview');

  useEffect(() => {
    if (!user) return;

    // Fetch tournaments where user is organizer
    const qT = query(collection(db, 'tournaments'), where('organizerId', '==', user.uid));
    const unsubscribeT = onSnapshot(qT, (sn) => {
      setTournaments(sn.docs.map(d => ({ id: d.id, ...d.data() }) as Tournament));
    });

    // Fetch teams where user is manager
    const qTm = query(collection(db, 'teams'), where('managerId', '==', user.uid));
    const unsubscribeTm = onSnapshot(qTm, (sn) => {
      setTeams(sn.docs.map(d => ({ id: d.id, ...d.data() }) as Team));
    });

    return () => { unsubscribeT(); unsubscribeTm(); };
  }, [user]);

  if (!user) return <div className="p-12 text-center text-slate-500">Please sign in to manage tournaments.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
           <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Organizer <span className="text-orange-500">Hub</span></h1>
           <p className="text-slate-400 font-medium">Manage your tournaments, teams, and professional scoring setup.</p>
        </div>
        <div className="flex space-x-4">
           <button 
             onClick={() => setActiveView('create_tournament')}
             className="primary-button flex items-center"
           >
              <Plus className="w-4 h-4 mr-2" />
              New Tournament
           </button>
           <button 
             onClick={() => setActiveView('create_team')}
             className="glass-button flex items-center text-white"
           >
              <Users className="w-4 h-4 mr-2" />
              New Team
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sidebar Stats */}
         <div className="space-y-6">
            <div className="glass-card p-6 bg-orange-600/10 border-orange-500/20">
               <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-orange-600 rounded-xl">
                     <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-black text-white">{tournaments.length}</span>
               </div>
               <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Active Tournaments</h3>
               <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-2/3" />
               </div>
            </div>

            <div className="glass-card p-6">
               <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-slate-800 rounded-xl">
                     <Users className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="text-3xl font-black text-white">{teams.length}</span>
               </div>
               <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">My Teams</h3>
               <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 w-1/2" />
               </div>
            </div>

            <button className="w-full glass-button flex items-center justify-between p-4 text-slate-400 group">
               <span className="flex items-center">
                  <LayoutIcon className="w-4 h-4 mr-3" />
                  Global Analytics
               </span>
               <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
         </div>

         {/* Main View */}
         <div className="lg:col-span-2 space-y-8">
            {activeView === 'overview' && (
              <>
                <section>
                   <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-600 mb-6 font-mono">Recent Tournaments</h2>
                   <div className="grid grid-cols-1 gap-4">
                      {tournaments.length > 0 ? tournaments.map(t => (
                        <div key={t.id} className="glass-card p-6 flex items-center justify-between group hover:border-orange-500/30 transition-all cursor-pointer">
                           <div className="flex items-center space-x-6">
                              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                                 <Trophy className="w-6 h-6 text-orange-500" />
                              </div>
                              <div>
                                 <div className="text-lg font-bold text-white uppercase italic">{t.name}</div>
                                 <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">{t.format} • {t.status}</div>
                              </div>
                           </div>
                           <Settings className="w-5 h-5 text-slate-700 group-hover:text-slate-400 transition-colors" />
                        </div>
                      )) : (
                        <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
                           No tournaments created yet.
                        </div>
                      )}
                   </div>
                </section>

                <section>
                   <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-600 mb-6 font-mono font-mono font-mono">Managed Teams</h2>
                   <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      {teams.map(team => (
                        <div key={team.id} className="glass-card p-6 flex items-center space-x-4">
                           <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                              <Users className="w-5 h-5 text-slate-400" />
                           </div>
                           <div className="text-sm font-bold text-white uppercase">{team.name}</div>
                        </div>
                      ))}
                   </div>
                </section>
              </>
            )}

            {activeView === 'create_tournament' && (
              <TournamentForm onCancel={() => setActiveView('overview')} />
            )}
            
            {activeView === 'create_team' && (
              <TeamForm onCancel={() => setActiveView('overview')} />
            )}
         </div>
      </div>
    </div>
  );
}

function TournamentForm({ onCancel }: { onCancel: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [format, setFormat] = useState('league');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'tournaments'), {
        name,
        format,
        status: 'upcoming',
        organizerId: user.uid,
        rules: {
          overs: 20,
          ballsPerOver: 6,
          wickets: 10,
          noBallType: 'reball_run',
          lastManStanding: false,
          boundaryTracking: false
        },
        createdAt: serverTimestamp()
      });
      onCancel();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8">Create <span className="text-orange-500">Tournament</span></h2>
      <form onSubmit={handleSubmit} className="space-y-6">
         <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tournament Name</label>
            <input 
              required
              className="input-field w-full" 
              placeholder="e.g. Khelbo Warriors Premier League"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
         </div>
         <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Format</label>
            <select 
              className="input-field w-full appearance-none"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
               <option value="league">League</option>
               <option value="knockout">Knockout</option>
               <option value="round_robin">Round Robin</option>
            </select>
         </div>
         <div className="flex space-x-4 pt-4">
            <button type="submit" disabled={loading} className="primary-button flex-grow">
               {loading ? 'Creating...' : 'Launch Tournament'}
            </button>
            <button type="button" onClick={onCancel} className="glass-button px-8 text-slate-400">Cancel</button>
         </div>
      </form>
    </motion.div>
  );
}

function TeamForm({ onCancel }: { onCancel: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'teams'), {
        name,
        managerId: user.uid,
        stats: { matchesPlayed: 0, wins: 0, losses: 0, ties: 0, nrr: 0 },
        createdAt: serverTimestamp()
      });
      onCancel();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8">Register <span className="text-orange-500">Team</span></h2>
      <form onSubmit={handleSubmit} className="space-y-6">
         <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Team Name</label>
            <input 
              required
              className="input-field w-full" 
              placeholder="e.g. Dhaka Dynamites"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
         </div>
         <div className="flex space-x-4 pt-4">
            <button type="submit" disabled={loading} className="primary-button flex-grow">
               {loading ? 'Registering...' : 'Register Team'}
            </button>
            <button type="button" onClick={onCancel} className="glass-button px-8 text-slate-400">Cancel</button>
         </div>
      </form>
    </motion.div>
  );
}
