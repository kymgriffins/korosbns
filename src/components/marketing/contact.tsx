"use client";

import React from 'react';
import Wrapper from '../global/wrapper';
import Container from '../global/container';
import { Button } from '../ui/button';
import { 
    Instagram, 
    Youtube, 
    Linkedin, 
    MessageSquare, 
    Mail, 
    Send,
    ArrowRight
} from 'lucide-react';

const XIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z"/>
    </svg>
);
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from 'motion/react';
import { cn } from '@/utils';
import Balancer from 'react-wrap-balancer';

const socials = [
    {
        name: 'X',
        icon: XIcon,
        href: 'https://x.com',
        username: '@budgetndiostory',
        color: 'bg-black',
        hoverColor: 'hover:bg-neutral-900',
        borderColor: 'border-white/10'
    },
    {
        name: 'YouTube',
        icon: Youtube,
        href: 'https://youtube.com',
        username: 'Budget Ndio Story',
        color: 'bg-[#FF0000]',
        hoverColor: 'hover:bg-[#E60000]',
        borderColor: 'border-white/20'
    },
    {
        name: 'Instagram',
        icon: Instagram,
        href: 'https://instagram.com',
        username: '@budgetndiostory',
        color: 'bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
        hoverColor: 'opacity-90',
        borderColor: 'border-white/20'
    },
    {
        name: 'LinkedIn',
        icon: Linkedin,
        href: 'https://linkedin.com',
        username: 'Budget Ndio Story',
        color: 'bg-[#0077B5]',
        hoverColor: 'hover:bg-[#006396]',
        borderColor: 'border-white/20'
    }
];

const Contact = () => {

    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        // Automatically open the modal after a short delay to "WOW" the user as requested
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-12 overflow-hidden bg-background">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
            </div>

            <Wrapper className="z-10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                        
                        {/* Left Side: Content (3/5 columns) */}
                        <div className="lg:col-span-3 flex flex-col space-y-6">
                            <Container animation="fadeRight">
                                <h1 className="text-5xl md:text-6xl font-bold font-heading tracking-tight leading-[1.1]">
                                    Let&apos;s talk <br /> 
                                    <span className="bg-linear-to-r from-primary via-blue-400 to-primary bg-size-[200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-transparent bg-clip-text">
                                        Budget Stories.
                                    </span>
                                </h1>
                                <p className="text-base md:text-lg text-foreground/60 mt-4 max-w-md">
                                    Have a question or want to collaborate? We&apos;re here to help you tell better stories with data.
                                </p>
                            </Container>

                            <Container animation="fadeRight" delay={0.2}>
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-medium shadow-xl shadow-primary/10 group w-full sm:w-fit">
                                            <MessageSquare className="mr-3 size-4 group-hover:rotate-12 transition-transform" />
                                            Send a Message
                                            <ArrowRight className="ml-3 size-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[450px] border-white/10 bg-black/60 backdrop-blur-3xl shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-heading font-bold">Direct Message</DialogTitle>
                                            <DialogDescription className="text-foreground/60">
                                                How can we help you today?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form className="space-y-4 py-4" onSubmit={(e) => e.preventDefault()}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Name</Label>
                                                    <Input id="name" placeholder="John Doe" className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary focus:bg-white/10 transition-all" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Email</Label>
                                                    <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary focus:bg-white/10 transition-all" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Message</Label>
                                                <Textarea id="message" placeholder="Your message here..." className="bg-white/5 border-white/10 min-h-[120px] rounded-xl focus:ring-primary focus:bg-white/10 transition-all resize-none p-4" />
                                            </div>
                                            <Button size="lg" className="w-full h-12 text-base rounded-xl font-bold">
                                                <Send className="mr-2 size-4" />
                                                Send Message
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </Container>
                        </div>

                        {/* Right Side: Reduced Social Media Icons (2/5 columns) */}
                        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                            {socials.map((social, index) => (
                                <Container 
                                    key={social.name} 
                                    animation="scaleUp" 
                                    delay={0.1 * index}
                                >
                                    <a 
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "group relative aspect-square flex flex-col items-center justify-center p-4 rounded-3xl border transition-all duration-300",
                                            social.color,
                                            social.borderColor,
                                            "hover:scale-[1.02] active:scale-[0.98]"
                                        )}
                                    >
                                        <div className="flex items-center justify-center size-10 mb-2 rounded-xl bg-white/20 backdrop-blur-md group-hover:scale-110 transition-transform">
                                            <social.icon className="size-5 text-white" />
                                        </div>
                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">{social.name}</span>
                                        <span className="text-[11px] font-medium text-white truncate max-w-[80px]">Follow</span>
                                    </a>
                                </Container>
                            ))}
                        </div>
                    </div>

                    <Container animation="fadeUp" delay={0.4} className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-foreground/30">
                        <p className="text-xs font-medium">© 2026 Budget Ndio Story.</p>
                        <div className="flex items-center gap-6 text-[11px] font-medium uppercase tracking-wider">
                            <a href="mailto:hello@budgetndiostory.com" className="hover:text-foreground transition-colors">Email</a>
                            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                        </div>
                    </Container>
                </div>
            </Wrapper>
        </section>
    );
};


export default Contact;
