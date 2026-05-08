import { db } from '../lib/firebase';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { Match, InningData } from '../types';

export async function updateStandingsAfterMatch(match: Match) {
  if (match.status !== 'completed' || !match.winnerId) return;

  const teamAId = match.teamAId;
  const teamBId = match.teamBId;
  const winnerId = match.winnerId;
  const isDraw = winnerId === 'draw';

  const inningA = match.liveData?.innnings.find(i => i.battingTeamId === teamAId);
  const inningB = match.liveData?.innnings.find(i => i.battingTeamId === teamBId);

  if (!inningA || !inningB) return;

  // Update Team A Stats
  await updateTeamStats(teamAId, {
    matchesPlayed: 1,
    wins: winnerId === teamAId ? 1 : 0,
    losses: winnerId === teamBId ? 1 : 0,
    ties: isDraw ? 1 : 0,
    runsScored: inningA.score,
    oversFaced: inningA.overs,
    runsConceded: inningB.score,
    oversBowled: inningB.overs
  });

  // Update Team B Stats
  await updateTeamStats(teamBId, {
    matchesPlayed: 1,
    wins: winnerId === teamBId ? 1 : 0,
    losses: winnerId === teamAId ? 1 : 0,
    ties: isDraw ? 1 : 0,
    runsScored: inningB.score,
    oversFaced: inningB.overs,
    runsConceded: inningA.score,
    oversBowled: inningA.overs
  });
}

async function updateTeamStats(teamId: string, delta: any) {
  const teamRef = doc(db, 'teams', teamId);
  const teamDoc = await getDoc(teamRef);
  
  if (!teamDoc.exists()) return;
  const data = teamDoc.data();
  
  const totalRunsScored = (data.stats.totalRunsScored || 0) + delta.runsScored;
  const totalOversFaced = (data.stats.totalOversFaced || 0) + delta.oversFaced;
  const totalRunsConceded = (data.stats.totalRunsConceded || 0) + delta.runsConceded;
  const totalOversBowled = (data.stats.totalOversBowled || 0) + delta.oversBowled;

  // NRR = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)
  const nrr = (totalRunsScored / (totalOversFaced || 1)) - (totalRunsConceded / (totalOversBowled || 1));

  await updateDoc(teamRef, {
    'stats.matchesPlayed': increment(delta.matchesPlayed),
    'stats.wins': increment(delta.wins),
    'stats.losses': increment(delta.losses),
    'stats.ties': increment(delta.ties),
    'stats.totalRunsScored': totalRunsScored,
    'stats.totalOversFaced': totalOversFaced,
    'stats.totalRunsConceded': totalRunsConceded,
    'stats.totalOversBowled': totalOversBowled,
    'stats.nrr': nrr
  });
}
