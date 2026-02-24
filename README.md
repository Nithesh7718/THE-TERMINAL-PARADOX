## THE TERMINAL PARADOX

This app was created using https://getmocha.com.
Need help or want to join the community? Join our [Discord](https://discord.gg/shDEGBSe2d).

To run the devserver:
```
npm install
npm run dev
```
## getmocha prompt
Build a full-stack coding competition web app called:

"Code Quest – 3 Rounds 3 Doors Challenge"

Tech Stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- Judge0 API for code execution
- Vercel deployment ready

SYSTEM STRUCTURE:

There are 3 Rounds.
Each Round has 3 Doors.
User can select any one door per round.
After completing selected door, automatically move to next round.
User cannot attempt multiple doors in same round.

ROUND 1 (Quiz):
- 3 Doors
- Each door has 15 unique MCQ questions
- Total 45 quiz questions
- Easy difficulty
- Questions loaded from backend only
- 15 minute timer
- Score 1 point per correct answer
- Must score >= 50% to unlock next round

ROUND 2 (Debug):
- 3 Doors
- Each door has 5 debug questions
- Before starting, user selects language:
  Python, Java, C, C++, JavaScript
- Questions change based on selected language
- 15 minute timer
- Use Judge0 API to test corrected code
- Score based on test cases passed
- Must score >= 50% to unlock Round 3

ROUND 3 (Coding):
- 3 Doors
- Each door has 2 full coding problems
- User selects programming language (same 5)
- Questions change based on selected language
- 30 minute timer
- Judge0 integration
- Final score calculated based on test cases passed

DATABASE STRUCTURE:

questions table:
- round
- door_number
- language (nullable for Round 1)
- type (mcq, debug, coding)
- question_text
- options JSON (for MCQ)
- correct_answer
- visible_test_cases JSON
- hidden_test_cases JSON

users table:
- id
- email
- current_round
- selected_door_round1
- selected_door_round2
- selected_door_round3

round_scores table:
- user_id
- round
- door_number
- score

SECURITY:
- Questions must only be fetched from backend
- Hide Judge0 API key in backend route
- Lock other doors once one is selected
- Validate round progression server-side
- Validate timer server-side
- Users can access only their own data

UI:
- Dark theme
- 3 door grid per round
- Timer component
- Monaco editor for coding
- Responsive design

Architecture:
- Modular structure
- /app routes
- /components
- /lib
- /api routes
- Production-ready setup
