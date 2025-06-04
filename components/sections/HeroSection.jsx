import React from "react";
import Button from "../buttons/Button";
import Link from "next/link";
//import HeroImage from "@/public/hero1.jpg";
//import ProConIcontext from "../ProConIcontext";
//import Image from "next/image";

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content text-center">
                <div className="max-w-4xl flex flex-col items-center">
                    <h1 className="text-6xl font-bold lg:text-7xl">
                        <span className="underline decoration-amber-400 decoration-7">
                            Effortlessly
                        </span> Manage Your Housing Expenses With Billio
                    </h1>
                    <div className="py-6">
                        <div>
                            Everything you need to track and manage all your houses, apartments, rentals in one place. Simplified expense management to stay organized and financially savvy.
                        </div>
                    </div>
                    {/*<div className="py-6">
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
                    </div>*/}
                    <Link href="/login"> {/* link to stripe checkout */}
                        <Button 
                            text={"SIGN UP"} //{"GET ACCESS"}
                            btnStyle={"btn-primary btn-lg"}
                        />
                    </Link>
                </div>
            </div>
            {/*<div>
                <Image 
                    src={HeroImage} 
                    alt="Hero image" 
                    className="max-w-2xl rounded-lg shadow-2x1"
                />
            </div>*/}
        </div>
    </section>
  )
}
