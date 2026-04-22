import { Metadata } from "next";
import { team } from "@/constants/team";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const member = team.find((m) => {
    const memberUsername = m.socials?.x?.split("/").pop() || m.name.toLowerCase().replace(/\s+/g, "");
    return memberUsername === username;
  });

  if (!member) {
    return { title: "Team Member Not Found" };
  }

  return {
    title: `${member.name} | Budget Ndio Story`,
    description: `${member.name} - ${member.role} at Budget Ndio Story. Making Kenya's budget transparent and accessible.`,
    openGraph: {
      title: `${member.name} | Budget Ndio Story`,
      description: `${member.name} - ${member.role} at Budget Ndio Story`,
      images: [member.image],
    },
  };
}

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

interface TeamMemberPageProps {
  params: Promise<{ username: string }>;
}

const TeamMemberProfile = ({ member }: { member: typeof team[0] }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[100px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-6 py-16"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Team
          </Link>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
            <Image
              src={member.image}
              alt={member.name}
              width={160}
              height={160}
              className="relative rounded-full object-cover border-4 border-background shadow-2xl size-40 mx-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mt-6 mb-2">{member.name}</h1>
            <p className="text-lg text-primary font-medium">{member.role}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mt-6"
          >
            {member.socials?.linkedin && (
              <Link
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <Linkedin className="size-5" />
              </Link>
            )}
            {member.socials?.x && (
              <Link
                href={member.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <Twitter className="size-5" />
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-4">About {member.name.split(" ")[0]}</h2>
          <p className="text-foreground/70 leading-relaxed mb-6">
            {member.name} is a dedicated member of the Budget Ndio Story team, serving as {member.role.toLowerCase()}. 
            With a passion for civic engagement and fiscal transparency, they contribute to making Kenya's budget 
            information accessible to all citizens.
          </p>
          
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Meet the full team
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {team.filter((m) => m.name !== member.name).slice(0, 3).map((m) => {
            const mUsername = m.socials?.x?.split("/").pop() || m.name.toLowerCase().replace(/\s+/g, "");
            return (
              <Link
                key={m.name}
                href={`/team/${mUsername}`}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <Image
                  src={m.image}
                  alt={m.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover mb-3 size-12 mx-auto"
                />
                <p className="text-sm font-medium text-center">{m.name.split(" ")[0]}</p>
                <p className="text-xs text-foreground/50 text-center">{m.role}</p>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const member = team.find((m) => {
    const memberUsername = m.socials?.x?.split("/").pop() || m.name.toLowerCase().replace(/\s+/g, "");
    return memberUsername === username;
  });

  if (!member) {
    notFound();
  }

  return <TeamMemberProfile member={member} />;
}