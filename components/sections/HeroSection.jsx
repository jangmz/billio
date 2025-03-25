import React from 'react';
import Button from '../buttons/Button';
import Link from 'next/link';
import ProConIcontext from '../ProConIcontext';

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
        <div className="mx-auto flex justify-center max-w-7xl px-5 py-10">
            <div className="flex flex-col items-center gap-8">
                <h1 className="font-bold text-5xl text-center">
                    Effortlessly Manage Your Housing Expenses With Billio
                </h1>
                <div>
                    <ProConIcontext
                        icon={"pro"}
                        text={"Track all housing bills in one place"}
                    />
                    <ProConIcontext
                        icon={"pro"}
                        text={"Track multiple properties (homes, apartments, rentals)"}
                    />
                    <ProConIcontext
                        icon={"pro"}
                        text={"Simplified expense management"}
                    />
                    <ProConIcontext
                        icon={"pro"}
                        text={"Stay organized and financially savvy"}
                    />
                </div>
                <Link href="/login"> {/* link to stripe checkout */}
                    <Button 
                        text={"GET ACCESS"}
                        btnStyle={"btn-primary"}
                    />
                </Link>
                
            </div>
            <div>
                {/* app image */}
            </div>
        </div>
    </section>
  )
}
