# Security Specification: CricPulse by Khelbo Warriors

## 1. Data Invariants
- A match must belong to two valid teams.
- A match scorer can only be assigned by the tournament organizer or an admin.
- Only the assigned scorer or an admin can record balls for a match.
- Players must belong to a valid team.
- Tournament winners/standings can only be finalized by the organizer.
- Team managers can only manage their own teams.
- Users cannot change their own roles to 'admin' (privilege escalation protection).

## 2. The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempt to create a tournament as another user.
2. **Privilege Escalation**: Attempt to set `role: "admin"` on own user profile.
3. **Orphaned Write**: Create a match with non-existent `teamId`.
4. **Scorer Hijacking**: Attempt to write a ball event for a match where the user is not the assigned scorer.
5. **Score Tampering**: Update a completed match's score.
6. **Stat Injection**: Directly update team wins/losses without a finished match (violates relational sync).
7. **Junk ID Poisoning**: Create a team with a 1MB string as ID.
8. **Negative Runs**: Record a ball with `-5` runs.
9. **Impossible Overs**: Record a ball for over `500` in a T20 match.
10. **Shadow Updates**: Update a match but inject `isVerified: true` hidden field.
11. **PII Leak**: Attempt to read another user's email/phone without being the owner or admin.
12. **Double Inning**: Attempt to start a 3rd inning in a standard limited-overs match.

## 3. Test Runner (Draft)
```typescript
// firestore.rules.test.ts (conceptual)
// ... standard imports ...
// Test: User cannot set own role to admin
await assertFails(setDoc(doc(db, 'users', 'myId'), { role: 'admin', ... }));

// Test: Non-scorer cannot write balls
await assertFails(addDoc(collection(db, 'matches/match123/balls'), { ... }));
```
