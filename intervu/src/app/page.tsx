import React from 'react';
import Header from '@/components/Header'
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-row w-full justify-center items-center gap-16 py-16 px-8 max-w-7xl mx-auto">
        <div className='flex flex-col justify-center max-w-[600px] items-start gap-6'>
          <h2 className='text-6xl font-bold leading-tight'>
            Practice smarter,<br />not harder.
          </h2>
          <p className='text-xl text-slate-300 leading-relaxed'>
            Your personal AI interview coach—realistic, customizable, and designed to help you improve with every answer.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Image 
            src="/raccoonWave.svg"
            alt="Ryan the Raccoon mascot waving"
            width={300}
            height={300}
          />
        </div>
      </section>

      {/* Leaves Decoration with CTA Button */}
      <section className="flex justify-between items-center w-full relative">
        <img 
          src="/leavesLeft.svg"
          alt="Decorative leaves"
          className="h-auto"
          style={{ width: '40%' }}
        />
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/instructions">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-12 py-4 rounded-[32px] transition-colors duration-200">
              Begin Practicing
            </button>
          </Link>
        </div>
        <img 
          src="/leavesRight.svg"
          alt="Decorative leaves"
          className="h-auto"
          style={{ width: '40%' }}
        />
      </section>

      

      {/* What is IntervU Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="bg-slate-800/50 rounded-lg h-80 flex items-center justify-center">
            <span className="text-slate-500">Demo Video</span>
          </div>
          <div>
            <h3 className="text-5xl font-bold mb-6">What is IntervU?</h3>
            <p className="text-lg text-slate-300 leading-relaxed">
              IntervU is an AI interview simulator that generates personalized behavioural and
              technical questions based on your resume and job description, offering realistic practice
              and feedback to help you prepare for real interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h3 className="text-5xl font-bold mb-6">Meet the Team</h3>
            <p className="text-lg text-slate-300 leading-relaxed">
              Brandon, Eric, Mark and Paul, are all Computing Science students at Simon
              Fraser University. While they build the app, the ever trustworthy (and mischievous)
              Ryan the Raccoon leads the interviews to guide IntervU's users onto the path to
              success.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="bg-slate-800/50 rounded-lg w-80 h-80 flex items-center justify-center relative">
              <span className="text-slate-500">Team Image</span>
              <div className="absolute bottom-4 right-4">
                <div className="text-6xl">🦝</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How does it work Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="bg-slate-800/50 rounded-lg h-80 flex items-center justify-center">
            <span className="text-slate-500">Process Diagram</span>
          </div>
          <div>
            <h3 className="text-5xl font-bold mb-6">How does it work?</h3>
            <p className="text-lg text-slate-300 leading-relaxed">
              IntervU is an AI interview simulator that generates personalized behavioural and
              technical questions based on your resume and job description, offering realistic practice
              and feedback to help you prepare for real interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Leaves Decoration Bottom */}
      <section className="flex justify-between w-full">
        <img 
          src="/leavesRight.svg"
          alt="Decorative leaves"
          className="h-auto"
          style={{ width: '40%' }}
        />
        <img 
          src="/leavesLeft.svg"
          alt="Decorative leaves"
          className="h-auto"
          style={{ width: '40%' }}
        />
        
      </section>
    </div>
  );
};

export default Home;