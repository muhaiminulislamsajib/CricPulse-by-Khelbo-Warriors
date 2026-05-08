import { useState, useCallback } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Match, BallData } from '../types';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { generateBallCommentary } from '../services/aiCommentary';

export function useScoring(match: Match) {
  const [loading, setLoading] = useState(false);

  const recordBall = useCallback(async (ballData: Partial<BallData>) => {
    if (!match.id) return;
    setLoading(true);

    try {
      // ... same logic for next state ...
      const settings = match.settings;
      const currentLiveData = match.liveData!;
      const currentInningIndex = currentLiveData.currentInning - 1;
      const currentInning = currentLiveData.innnings[currentInningIndex];

      let nextStrikerId = ballData.strikerId || currentLiveData.strikerId;
      let nextNonStrikerId = ballData.nonStrikerId || currentLiveData.nonStrikerId;
      
      const runs = ballData.runs || 0;
      const isExtra = ballData.extrasType && ballData.extrasType !== 'none';
      const isNoBall = ballData.extrasType === 'noball';
      const isWide = ballData.extrasType === 'wide';

      const causesRotation = (runs % 2 !== 0);
      
      if (!settings.oneSideBatting && causesRotation && !isWide) {
        [nextStrikerId, nextNonStrikerId] = [nextNonStrikerId, nextStrikerId];
      }

      const ballDoc: BallData = {
        inningNumber: currentLiveData.currentInning,
        overNumber: Math.floor(currentInning.overs),
        ballNumber: Math.floor((currentInning.overs % 1) * 10) + 1,
        strikerId: currentLiveData.strikerId,
        nonStrikerId: currentLiveData.nonStrikerId,
        bowlerId: currentLiveData.bowlerId,
        runs: runs,
        extras: ballData.extras || 0,
        extrasType: ballData.extrasType || 'none',
        isWicket: !!ballData.isWicket,
        wicketDetail: ballData.wicketDetail,
        timestamp: serverTimestamp(),
        matchId: match.id
      };

      // Generate AI Commentary
      const aiCommentary = await generateBallCommentary(match, ballDoc);
      ballDoc.commentary = aiCommentary;

      await addDoc(collection(db, 'matches', match.id, 'balls'), ballDoc);

      // ... logic for score update ...
      let newScore = currentInning.score + runs + (ballData.extras || 0);
      let newWickets = currentInning.wickets + (ballData.isWicket ? 1 : 0);
      
      let newBallCount = Math.round((currentInning.overs % 1) * 10) + 1;
      let newOverCount = Math.floor(currentInning.overs);
      
      const isLegalBall = !isNoBall && !isWide;
      
      if (isLegalBall) {
        if (newBallCount >= settings.ballsPerOver) {
          newOverCount += 1;
          newBallCount = 0;
          if (!settings.oneSideBatting) {
            [nextStrikerId, nextNonStrikerId] = [nextNonStrikerId, nextStrikerId];
          }
        }
      } else {
         newBallCount -= 1; 
      }

      const newOvers = newOverCount + (newBallCount / 10);
      const nextInnings = [...currentLiveData.innnings];
      nextInnings[currentInningIndex] = {
        ...currentInning,
        score: newScore,
        wickets: newWickets,
        overs: newOvers
      };

      await updateDoc(doc(db, 'matches', match.id), {
        'liveData.innnings': nextInnings,
        'liveData.strikerId': nextStrikerId,
        'liveData.nonStrikerId': nextNonStrikerId,
      });

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `matches/${match.id}/balls`);
    } finally {
      setLoading(false);
    }
  }, [match]);

  return { recordBall, loading };
}
