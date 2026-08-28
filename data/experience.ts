import type { Experience } from "@/types/portfolio";

export const experience: readonly Experience[] = [
  {
    organization: "PT Dermaga Perkasapratama",
    role: "IT & Network Intern",
    dates: "August 2026 - Present",
    description: "Supporting day-to-day IT operations and gaining practical exposure to enterprise networking infrastructure.",
    responsibilities: ["Troubleshoot workstations, devices, and printers", "Prepare and crimp LAN cabling for endpoint connectivity", "Support patch-panel connections and network endpoints", "Configure IP addresses and subnets under team guidance"],
    technologies: ["LAN", "TCP/IP", "Workstation support", "Network infrastructure"],
  },
  {
    organization: "SOC Elite Programme - APU x Techforte",
    role: "SOC Analyst Trainee",
    dates: "April 2026 - June 2026",
    description: "Practiced security monitoring and incident documentation in a supervised SOC training environment.",
    responsibilities: ["Monitored suspicious logs and security events in the APU environment", "Investigated potential security anomalies", "Documented findings for SOC lead review", "Practiced incident escalation workflows"],
    technologies: ["Log analysis", "Incident reporting", "SOC operations"],
  },
  {
    organization: "Bank Mandiri Indonesia x Rakamin Academy",
    role: "Project-Based Intern, Mobile Apps Developer",
    dates: "2026",
    description: "Built Android application functionality in an Agile, project-based internship environment.",
    responsibilities: ["Developed Kotlin application features with REST APIs", "Implemented SQLite-backed functionality", "Performed testing and debugging", "Used GitLab-based version control workflows"],
    technologies: ["Kotlin", "Android", "REST APIs", "SQLite", "GitLab"],
  },
  {
    organization: "Persatuan Pelajar Indonesia Malaysia",
    role: "Data & IT Officer, Bureau of Data and IT",
    dates: "2025 - 2026",
    description: "Supported internal data, access, and operational technology workflows for the organization.",
    responsibilities: ["Developed an internal ticketing workflow", "Managed organizational data workflows", "Supported data access control", "Helped maintain internal system reliability with IT and operations"],
  },
] as const;
