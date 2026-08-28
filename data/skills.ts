export const skillGroups = [
  { title: "Security", items: ["Network Security", "OS Security", "Reverse Engineering", "OSINT", "Digital Forensics", "Web Security", "Incident Response", "Threat Intelligence", "SOC Operations"] },
  { title: "Security Tools", items: ["Burp Suite", "Wireshark", "Ghidra", "Nmap", "Metasploit", "Kali Linux"] },
  { title: "Programming", items: ["Python", "Java", "Kotlin", "JavaScript", "Lua", "C", "C++", "Bash", "SQL"] },
  { title: "Systems and Infrastructure", items: ["Linux", "Docker", "Git", "GitHub", "AWS", "Firebase"] },
  { title: "Data and Development", items: ["MSSQL", "SQLite", "Android Studio", "GitLab"] },
] as const;

export const certifications = [
  { issuer: "Cisco", title: "CCNA: Introduction to Networks" },
  { issuer: "Cisco", title: "CCNA: Switching, Routing, and Wireless Essentials" },
  { issuer: "Red Hat", title: "Red Hat System Administration I" },
  { issuer: "Red Hat", title: "Red Hat System Administration II" },
] as const;

export const training = {
  issuer: "OffSec",
  title: "CyberCore",
  detail: "Training access awarded through APU Internal CTF MVP recognition",
} as const;
