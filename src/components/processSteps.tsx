import React from "react";

const IconDiscovery = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconSourcing = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0zm6 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h12a2 2 0 012 2z" />
  </svg>
);

const IconScreening = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconMatch = (props: React.SVGProps<SVGSVGElement>) => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);


export interface ProcessStep {
  stepNumber: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const processSteps: ProcessStep[] = [
  {
    stepNumber: "01",
    icon: <IconDiscovery />,
    title: "Discovery & Analysis",
    description: "We dive deep into understanding your needs, company culture, and specific requirements.",
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    stepNumber: "02",
    icon: <IconSourcing />,
    title: "Talent Sourcing",
    description: "Using our extensive network and advanced tools, we identify the best candidates for your role.",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    stepNumber: "03",
    icon: <IconScreening />,
    title: "Screening & Selection",
    description: "Rigorous vetting process including skills assessment, cultural fit evaluation, and interviews.",
    iconBgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    stepNumber: "04",
    icon: <IconMatch />,
    title: "Perfect Match",
    description: "We facilitate the connection and support both parties through the entire placement process.",
    iconBgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];