import React from 'react';
import Header from '@/components/Header'
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 sm:pt-28 md:pt-32">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row w-full justify-center items-center gap-8 md:gap-16 py-8 md:py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className='flex flex-col justify-center max-w-[600px] items-center md:items-start gap-4 md:gap-6 text-center md:text-left'>
          <h2 className='text-4xl md:text-6xl font-bold leading-tight'>
            Practice made<br />for you, by you.
          </h2> 
          <p className='text-lg md:text-xl text-slate-300 leading-relaxed'>
            Your personal AI interview coach—realistic, customizable, and designed to help you improve with every answer.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Image 
            src="/raccoonWave.svg"
            alt="Ryan the Raccoon mascot waving"
            width={300}
            height={300}
            className="w-48 h-48 md:w-[300px] md:h-[300px]"
          />
        </div>
      </section>

      {/* Leaves Decoration with CTA Button */}
      <section className="flex justify-between items-center w-full relative my-4 md:my-0">
        <img 
          src="/leavesLeft.svg"
          alt="Decorative leaves"
          className="h-auto w-[25%] md:w-[40%]"
        />
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/instructions">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm md:text-lg px-6 md:px-12 py-3 md:py-4 rounded-[32px] transition-colors duration-200">
              Begin Practicing
            </button>
          </Link>
        </div>
        <img 
          src="/leavesRight.svg"
          alt="Decorative leaves"
          className="h-auto w-[25%] md:w-[40%]"
        />
      </section>

      

      {/* What is IntervU Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="bg-slate-800/50 rounded-lg h-60 md:h-80 flex items-center justify-center overflow-hidden border border-slate-700">
            <Image
              src="/whatIsIntervU.png"
              alt="What is IntervU"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">What is IntervU?</h3>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              IntervU is an AI interview simulator that generates personalized behavioural and
              technical questions based on your resume and job description, offering realistic practice
              and feedback to help you prepare for real interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Meet the Team</h3>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              Brandon, Eric, Mark and Paul, are all Computing Science students at Simon
              Fraser University. While they build the app, the ever trustworthy (and mischievous)
              Ryan the Raccoon leads the interviews to guide IntervU's users onto the path to
              success.
            </p>
          </div>
          <Image
              src="/carryingMark.jpg"
              alt="Team Photo"
              width={800}
              height={600}
              className="w-full h-full object-cover rounded-lg border border-slate-700"
            />
        </div>
      </section>

      {/* How does it work Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="flex items-center justify-center">
            <img 
              src="/companies.svg" 
              alt="Process Diagram"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">How does it work?</h3>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              IntervU is powered by cutting-edge AI from Gemini and ElevenLabs, giving you a truly immersive interview experience. Get custom questions, instant feedback, and real-time voice interaction—just like the real thing. Our backend runs on Render, and Vercel keeps everything lightning fast for Stormhacks 2025.
            </p>
          </div>
        </div>
      </section>

      {/* Leaves Decoration Bottom */}
      <section className="flex justify-between w-full mt-8 md:mt-0">
        <img 
          src="/leavesRight.svg"
          alt="Decorative leaves"
          className="h-auto w-[25%] md:w-[40%]"
        />
        <img 
          src="/leavesLeft.svg"
          alt="Decorative leaves"
          className="h-auto w-[25%] md:w-[40%]"
        />
        
      </section>
    </div>
  );
};

export default Home;