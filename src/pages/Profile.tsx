import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { User, Mail, Shield, Calendar, LogOut, Settings, Award, Edit3 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Profile() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse font-mono uppercase tracking-widest text-sm italic">Synchronizing Profile...</div>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-12 glass-card text-center">
         <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-700">
            <User className="w-10 h-10 text-slate-600" />
         </div>
         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Access Denied</h2>
         <p className="text-slate-400 mb-8">Please sign in to view your professional cricket profile and stats.</p>
         <button className="primary-button w-full py-4 text-lg">Sign In with Google</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass-card overflow-hidden">
         {/* Cover */}
         <div className="h-40 bg-gradient-to-r from-orange-600/30 to-rose-600/30 border-b border-slate-800" />
         
         <div className="px-8 pb-12 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-8">
               <div className="w-32 h-32 rounded-3xl border-4 border-slate-950 overflow-hidden shadow-2xl relative group">
                  <img 
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                    className="w-full h-full object-cover bg-slate-900" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                     <Edit3 className="w-6 h-6 text-white" />
                  </div>
               </div>
            </div>

            <div className="pt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div>
                  <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-1">{profile?.displayName}</h1>
                  <div className="flex items-center space-x-3 text-slate-400 text-sm font-medium">
                     <Mail className="w-4 h-4" />
                     <span>{user.email}</span>
                  </div>
               </div>
               
               <div className="flex space-x-3">
                  <button className="glass-button flex items-center text-white px-6">
                     <Settings className="w-4 h-4 mr-2" />
                     Settings
                  </button>
                  <button 
                    onClick={() => signOut(auth)}
                    className="glass-button flex items-center text-rose-500 border-rose-500/20 hover:bg-rose-500/10 px-6"
                  >
                     <LogOut className="w-4 h-4 mr-2" />
                     Logout
                  </button>
               </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4 flex items-center">
                     <Shield className="w-3 h-3 mr-2 text-orange-500" />
                     Account Role
                  </div>
                  <div className="text-xl font-bold text-white uppercase italic">{profile?.role}</div>
               </div>

               <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4 flex items-center">
                     <Calendar className="w-3 h-3 mr-2 text-orange-500" />
                     Member Since
                  </div>
                  <div className="text-xl font-bold text-white uppercase italic">
                     {new Date(profile?.createdAt?.seconds * 1000).toLocaleDateString() || 'Recently'}
                  </div>
               </div>

               <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4 flex items-center">
                     <Award className="w-3 h-3 mr-2 text-orange-500" />
                     Ranking
                  </div>
                  <div className="text-xl font-bold text-white uppercase italic">Amateur Scorer</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
