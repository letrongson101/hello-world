# Lì Xì Tết - Bank Team MVP

## Run
1. `npm i`
2. `cp .env.example .env` và set `ADMIN_PASSWORD`
3. `npx prisma migrate dev --name init`
4. `npm run seed`
5. `npm run dev`

## Flow
- `/admin`: setup event, upload CSV (mode B), generate envelopes, monitor leaderboard, reset.
- `/open`: zero-input claim (mode A qua `uid,name` từ SSO callback hoặc mode B qua token).

## Manual test checklist
- [ ] 2 người mở cùng lúc không trùng receipt (transaction).
- [ ] refresh sau khi mở vẫn đúng kết quả cũ.
- [ ] average nằm trong tolerance ±10%.
- [ ] leaderboard đúng top 10.
- [ ] mode A lấy đúng displayName (từ uid/name mapping).
- [ ] mode B token chỉ claim 1 lần.
