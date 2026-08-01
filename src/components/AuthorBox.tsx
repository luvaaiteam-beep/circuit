import React from 'react';
import { Mail } from 'lucide-react';

export const AuthorBox = () => (
  <div className="mt-16 p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold border border-cyan-900 text-lg shrink-0">
        AD
      </div>
      <div>
        <h3 className="text-white font-bold text-lg mb-1">Written by Advik — building CircuitForge solo</h3>
        <p className="text-zinc-400 text-sm leading-7 mb-3">
          I'm a student, not a professional electrical engineer — I don't have a
          degree or industry experience in electronics. I started CircuitForge
          because I wanted a better way to learn circuits myself, and I write
          these guides as I go.
        </p>
        <p className="text-zinc-400 text-sm leading-7 mb-3">
          Every article is backed by real research — datasheets, textbooks, and
          the references linked below — and I use AI tools as part of my
          research and writing process to help me work faster. I still check
          every technical claim myself before it goes up.
        </p>
        <p className="text-zinc-400 text-sm leading-7 m-0">
          Found something wrong? I'd genuinely like to know —
          <a href="mailto:luvaai.team@gmail.com" className="text-cyan-400 hover:underline inline-flex items-center gap-1 ml-1">
            <Mail className="w-3.5 h-3.5" /> email me
          </a> and I'll fix it fast.
        </p>
      </div>
    </div>
  </div>
);
