import React from "react";
import { IconSearch, IconUsers, IconOffice, IconMarket, IconContract, IconCareer } from "../icons/serviceIcons";

export interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  learnMoreLink: string;
}

export const services: ServiceItem[] = [
  {
    icon: <IconSearch />,
    title: "Executive Search",
    description: "Finding C-level executives and senior management professionals for leadership roles.",
    features: ["Executive headhunting", "Leadership assessment", "Succession planning"],
    learnMoreLink: "/job-seekers",
  },
  {
    icon: <IconUsers />,
    title: "Permanent Placement",
    description: "Full-time permanent positions across all industries and experience levels.",
    features: ["Skills matching", "Cultural fit assessment", "Career guidance"],
    learnMoreLink: "/job-seekers",
  },
  {
    icon: <IconOffice />,
    title: "Corporate Solutions",
    description: "Comprehensive recruitment solutions for businesses of all sizes.",
    features: ["Volume recruitment", "Onboarding support", "Retention strategies"],
    learnMoreLink: "/job-seekers",
  },
  {
    icon: <IconMarket />,
    title: "Market Intelligence",
    description: "Data-driven insights into salary trends, market conditions, and talent availability.",
    features: ["Salary benchmarking", "Market analysis", "Talent mapping"],
    learnMoreLink: "/job-seekers",
  },
  {
    icon: <IconContract />,
    title: "Contract Staffing",
    description: "Flexible staffing solutions for project-based and temporary assignments.",
    features: ["Project staffing", "Interim management", "Flexible contracts"],
    learnMoreLink: "/job-seekers",
  },
  {
    icon: <IconCareer />,
    title: "Career Consulting",
    description: "Professional career development and coaching services for job seekers.",
    features: ["Resume optimization", "Interview coaching", "Career planning"],
    learnMoreLink: "/job-seekers",
  },
];