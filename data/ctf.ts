import type { CtfResult } from "@/types/portfolio";

export const ctfResults: readonly CtfResult[] = [
  { year: 2026, event: "HackNyx CTF 2026", shortEvent: "HackNyx CTF", result: "2nd Place", type: "Jeopardy", scope: "National", organization: "German-Malaysian Institute CySec", representation: "Representing APU", featured: true },
  { year: 2026, event: "Hack@10 International CTF 2026", shortEvent: "Hack@10", result: "3rd Place", type: "Jeopardy", scope: "International", organization: "Universiti Tenaga Nasional", representation: "Representing APU", featured: true },
  { year: 2026, event: "ICTF 2026", shortEvent: "ICTF", result: "4th Place + MVP #2", type: "Jeopardy", scope: "National", team: "Ais Cendol", detail: "MVP #2 for solving one of the least-solved challenges, The Automaton's Echoes.", featured: true },
  { year: 2026, event: "UM Cybersecurity Summit Attack and Defend Finals", shortEvent: "UMCS Attack and Defend Finals", result: "6th Place", type: "Attack and Defense", scope: "National", organization: "Universiti Malaya", representation: "Finalist, representing APU", featured: true },
  { year: 2026, event: "APU CTF Class Competition", shortEvent: "APU CTF Class Competition", result: "2nd Place", type: "Jeopardy", scope: "APU", featured: false },
  { year: 2025, event: "BingoCTF 2025", shortEvent: "BingoCTF", result: "6th Place", type: "Jeopardy", scope: "National", featured: false },
  { year: 2025, event: "International Game of Hackers Final", shortEvent: "International Game of Hackers", result: "Top 16 Finalist", type: "Jeopardy", scope: "International", organization: "UniKL-MIIT", featured: false },
  { year: 2025, event: "International Battle of Hackers 2025", shortEvent: "International Battle of Hackers", result: "23rd Place", type: "Jeopardy", scope: "International", detail: "International category", featured: false },
  { year: 2025, event: "Curtin CTF 2025", shortEvent: "Curtin CTF", result: "20th Place", type: "Jeopardy", scope: "International", detail: "24-hour international CTF", featured: false },
  { year: 2025, event: "APU Internal Capture the Flag MVP", shortEvent: "APU Internal CTF MVP", result: "MVP Recognition", type: "Recognition", scope: "APU", detail: "Recognition included OffSec CyberCore training access.", featured: false },
] as const;
