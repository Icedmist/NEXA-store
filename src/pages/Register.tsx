import React from 'react';
import { ModeToggle } from "@/components/ModeToggle";
import StoreRegistrationSection from "@/landing/store-registration";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] dark:bg-background overflow-x-hidden flex flex-col justify-start items-center transition-colors duration-500 grid-background dot-pattern">
      {/* Decorative vertical lines */}
      <div className="grid-lines-container">
        <div className="grid-lines-inner">
          <div className="grid-line"></div>
          <div className="grid-line"></div>
          <div className="grid-line"></div>
        </div>
      </div>

      <div className="w-full relative z-10 flex flex-col items-center">
        {/* Simple Header */}
        <div className="w-full h-20 flex justify-center items-center px-6 sm:px-8 border-b border-[rgba(55,50,47,0.08)] dark:border-white/5 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-7xl flex justify-between items-center">
            <div 
              onClick={() => navigate("/")} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 flex items-center justify-center border border-[rgba(55,50,47,0.12)] group-hover:border-accent transition-colors shadow-sm">
                <ArrowLeft className="w-4 h-4 text-[#37322F] dark:text-gray-400 group-hover:text-accent" />
              </div>
              <span className="text-xl font-medium text-[#2F3037] dark:text-white">Nexa</span>
            </div>
            <ModeToggle />
          </div>
        </div>

        {/* Content */}
        <div className="w-full flex justify-center py-12">
          <div className="w-full max-w-7xl">
            <StoreRegistrationSection />
          </div>
        </div>
      </div>
    </div>
  );
}
