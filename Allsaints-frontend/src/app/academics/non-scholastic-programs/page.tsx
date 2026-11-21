"use client";

import { useState } from "react";

const PROGRAMS = [
  {
    code: "LUSE",
    title: "Let Us Speak English",
    desc: "Class-wise daily programme for improving Spoken English on a specific syllabus monitored by teachers and lead by the students."
  },
  {
    code: "MMC",
    title: "MEGA MUSIC CARNIVAL",
    desc: "An opening for hundreds of students to sing in public under the leadership of the Music club which in turn makes wonderful positive changes in the confidence level of our students."
  },
  {
    code: "CuC",
    title: "CAN YOU CHALLENGE",
    desc: "Class-wise and common one minute spontaneous, easy flowing and uninterrupted speeches on certain criteria on precise topics in different languages. Once any blocks to the easy flow or deviation from the topic is detected and challenged according to the criteria, the chance goes to the challenger. Different language teachers will conduct it occasionally."
  },
  {
    code: "AQAD",
    title: "A Question A Day",
    desc: "Minimum 5 teams in a class will conduct quiz programme daily on specific areas and will register the scores and prizes for the winners will be awarded on termly basis."
  },
  {
    code: "WoW",
    title: "WONDERS out of WASTE",
    desc: "Students will be given training and practice for waste management, recycling and production of wonderful, beautiful and useful things out of the so-called wastes."
  },
  {
    code: "LAMI",
    title: "LAUGHING MINUTE",
    desc: "In order to create a happy mood throughout the period/day and to raise the happiness index, students and teachers will laugh in common for a few seconds as and when required on certain stimulus and on a specific schedule."
  },
  {
    code: "SPEL-PRO",
    title: "Spelling and Pronunciation Contest",
    desc: "Class-wise spelling and pronunciation competitions based on certain criteria fully managed by the students from class 5 onwards."
  },
  {
    code: "CooT",
    title: "CREATIONS out of TOPICS",
    desc: "Students will create various innovative charts, PPTs, videos, artforms, games, still and running models, including sophisticated Robots etc. on the basis of the topics they learn and will present/exhibit them in classes, art gallery, on stage and theatre. Extension lectures, seminars, and workshops are also part of CooT."
  },
  {
    code: "ANWRD",
    title: "A NEW WORD RESEARCH DAILY",
    desc: "All students in a class on a rotation basis find out a new word from the dictionary placed in the classroom and explain its exact meaning, origin, and various applications in public."
  },
  {
    code: "DUK",
    title: "DO YOU KNOW",
    desc: "Students from class 6 onwards present daily in their classes in one minute latest information and wisdom beyond their syllabus from different areas of knowledge. This information is codified and published."
  },
  {
    code: "PGT",
    title: "Peer Group Teaching",
    desc: "Peer groups, formed systematically in each class, help each other to improve in academic matters based on a schedule and direct monitoring."
  },
  {
    code: "CYBER",
    title: "CYBER AWARENESS & ANTI-NARCOTIC ACTIVITIES",
    desc: "Awareness and public programmes conducted for students to conscientize them about cybercrimes and ill effects of narcotics as well as instigating them to be vigilant against anti-social activities."
  },
  {
    code: "CRAOly",
    title: "CHESS / RUBIK'S CUBE / ABACUS OLYMPIADS",
    desc: "Regular Olympiads for chess, Rubik's Cube, Abacus etc. conducted for intellectual and strategic mind enhancement."
  },
  {
    code: "ReQu",
    title: "REVERSE QUIZZING / QUESTIONING",
    desc: "Students are equipped with thinking critically through a series of events to explore, create and ask well set and unsought questions on topics either from the syllabus or in general."
  },
  {
    code: "MaW",
    title: "Mentor and Ward",
    desc: "Special attention, mentoring, basic counselling, character formation, and career orientation for students from class seven onwards."
  },
  {
    code: "PiL",
    title: "PLEASURE in LEISURE",
    desc: "Special programmes conducted occasionally for making leisure time productive and creative while enjoying moments with friends. Students invent and display the programmes under teacher supervision."
  },
  {
    code: "DeQui",
    title: "DEBATE AND QUIZ",
    desc: "In addition to AQAD, scheduled class-wise and common Debate and Quiz programmes under the auspices of Quiz and Debate Clubs, giving top performers opportunities in inter-school competitions."
  },
  {
    code: "DGP",
    title: "DISCIPLE GURU PROGRAMMES",
    desc: "Students teach in their own or lower classes on learnt or self-learnt topics with all teaching aids. This boosts confidence, maturity, and subject mastery. Best performers are recognized."
  },
  {
    code: "SP",
    title: "Saintsian Parliament",
    desc: "Student parliament constituted to impart and instill parliamentary democratic values and governance notions into young Indians."
  }
];

export default function NonScholasticPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = PROGRAMS.filter(
    (p) =>
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFB900] block mb-2">
            Academics &bull; Holistic Initiatives
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#092F78] mb-3">
            Educational Programs
          </h1>
          <div className="w-16 h-1 bg-[#FFB900] rounded-full mx-auto mb-4" />
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pioneering non-scholastic co-curricular platforms designed to awaken student creativity, eloquence, civic leadership, and critical enquiry.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search programs by name, code or keyword..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[#D8EAF8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0875C9] focus:border-transparent shadow-sm"
            />
            <span className="absolute left-4 top-3.5 text-slate-400">
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p.code}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#D8EAF8] transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-[#0875C9] to-[#FFB900] absolute top-0 left-0" />
              <div>
                <div className="flex items-center gap-2 mb-3 pt-2">
                  <span className="px-2.5 py-0.5 bg-[#EAF6FF] text-[#0875C9] font-bold text-xs rounded-full border border-[#D8EAF8]">
                    {p.code}
                  </span>
                  <h2 className="text-base font-serif font-bold text-[#092F78] leading-snug">
                    {p.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>All Saints Initiative</span>
                <span className="text-[#FFB900] font-semibold">Active &bull; Co-Curricular</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#D8EAF8]">
            <p className="text-slate-500 text-sm">No educational program matched &quot;{searchTerm}&quot;</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-xs font-bold text-[#0875C9] hover:underline"
            >
              Show all 19 programs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
