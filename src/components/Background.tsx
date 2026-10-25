import React from 'react';
import { ThreeDevotionalCanvas } from './ThreeDevotionalCanvas';

export const Background: React.FC = () => {
  return (
    <>
      {/* 3D Golden Cosmic Particle, Floating Lotus Petals & Sacred Ring Canvas */}
      <ThreeDevotionalCanvas />

      {/* Deep spiritual atmospheric gradient base */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-gradient-to-b from-[#070b14] via-[#0b101d] to-[#05080e]" />

      {/* Soft Saffron & Golden Sacred Auras */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Top-right spiritual golden radiance */}
        <div 
          className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#F59E0B]/12 via-[#EA580C]/8 to-transparent blur-[120px]"
        />

        {/* Center subtle divine mandala halo */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-[#FFD700]/6 via-[#F59E0B]/5 to-transparent blur-[140px]"
        />

        {/* Bottom-left soft twilight glow */}
        <div 
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#EA580C]/10 via-[#7C2D12]/6 to-transparent blur-[130px]"
        />

        {/* Subtle sacred Vedic sacred geometric grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:32px_32px]"
        />
      </div>
    </>
  );
};
