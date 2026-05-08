export type UserRole = 'admin' | 'organizer' | 'team_manager' | 'scorer' | 'viewer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: any;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  format: 'league' | 'knockout' | 'round_robin' | 'group_stage' | 'hybrid';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizerId: string;
  rules: TournamentRules;
  createdAt: any;
}

export interface TournamentRules {
  overs: number;
  ballsPerOver: number;
  wickets: number;
  noBallType: 'reball_run' | 'run_only';
  lastManStanding: boolean;
  boundaryTracking: boolean;
  oneSideBatting?: boolean;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  managerId: string;
  stats: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    ties: number;
    nrr: number;
  };
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  role?: 'batter' | 'bowler' | 'all-rounder';
  battingStyle?: string;
  bowlingStyle?: string;
  jerseyNumber?: string;
  isCaptain?: boolean;
  isWicketkeeper?: boolean;
}

export interface Match {
  id: string;
  tournamentId?: string;
  teamAId: string;
  teamBId: string;
  status: 'upcoming' | 'live' | 'completed' | 'abandoned';
  format?: string;
  venue?: string;
  startTime: any;
  scorerId?: string;
  winnerId?: string;
  resultNote?: string;
  liveData?: MatchLiveData;
  settings: TournamentRules;
}

export interface MatchLiveData {
  currentInning: number;
  innnings: InningData[];
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  target?: number;
}

export interface InningData {
  battingTeamId: string;
  bowlingTeamId: string;
  score: number;
  wickets: number;
  overs: number; // Decimal format like 10.4
  balls: BallData[];
}

export interface BallData {
  matchId?: string;
  inningNumber: number;
  overNumber: number;
  ballNumber: number;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  runs: number;
  extras: number;
  extrasType: 'none' | 'wide' | 'noball' | 'bye' | 'legbye' | 'penalty';
  isWicket: boolean;
  wicketDetail?: {
    type: string;
    outPlayerId: string;
    fielderId?: string;
  };
  commentary?: string;
  timestamp: any;
}
