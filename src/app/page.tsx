import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { Download } from "lucide-react";
import { Suspense } from "react";

// Constants for better performance
const BLUR_FADE_DELAY = 0.04;
const ANIMATION_CONFIG = {
  duration: 0.4,
  staggerDelay: 0.05,
} as const;

// Separated components for better code splitting
function HeroSection() {
  return (
    <section id="hero" className="scroll-mt-16">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="gap-2 flex justify-between">
          <div className="flex-col flex flex-1 space-y-1.5">
            <BlurFadeText
              delay={BLUR_FADE_DELAY}
              className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
              yOffset={8}
              text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
            />
            <BlurFadeText
              className="max-w-[600px] md:text-xl"
              delay={BLUR_FADE_DELAY}
              text={DATA.description}
            />
            <BlurFade delay={BLUR_FADE_DELAY + 0.1}>
              <Button asChild className="mt-4 transition-all duration-200 hover:scale-105">
                <Link 
                  href="https://drive.google.com/file/d/1bMG_L1FO41fLddGnmUVas6ZeWGspLqI0/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </BlurFade>
          </div>
          <BlurFade delay={BLUR_FADE_DELAY}>
            <Avatar className="size-28 border shadow-lg">
              <AvatarImage 
                alt={DATA.name} 
                src={DATA.avatarUrl}
                className="object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <AvatarFallback className="text-lg font-semibold">
                {DATA.initials}
              </AvatarFallback>
            </Avatar>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h2 className="text-xl font-bold">About</h2>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
          {DATA.summary}
        </Markdown>
      </BlurFade>
    </section>
  );
}

function WorkExperienceSection() {
  return (
    <section id="work" className="scroll-mt-16">
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h2 className="text-xl font-bold">Work Experience</h2>
        </BlurFade>
        {DATA.work.map((work, id) => (
          <BlurFade
            key={work.company}
            delay={BLUR_FADE_DELAY + id * ANIMATION_CONFIG.staggerDelay}
          >
            <ResumeCard
              logoUrl={work.logoUrl}
              altText={work.company}
              title={work.company}
              subtitle={work.title}
              href={work.href}
              badges={work.badges}
              period={`${work.start} - ${work.end ?? "Present"}`}
              description={work.description}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section id="education" className="scroll-mt-16">
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h2 className="text-xl font-bold">Education</h2>
        </BlurFade>
        {DATA.education.map((education, id) => (
          <BlurFade
            key={education.school}
            delay={BLUR_FADE_DELAY + id * ANIMATION_CONFIG.staggerDelay}
          >
            <ResumeCard
              href={education.href}
              logoUrl={education.logoUrl}
              altText={education.school}
              title={education.school}
              subtitle={education.degree}
              period={`${education.start} - ${education.end}`}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-16">
      <div className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h2 className="text-xl font-bold">Skills</h2>
        </BlurFade>
        <div className="flex flex-wrap gap-1">
          {DATA.skills.map((skill, id) => (
            <BlurFade key={skill} delay={BLUR_FADE_DELAY + id * 0.02}>
              <Badge 
                variant="secondary" 
                className="transition-all duration-200 hover:scale-105 hover:shadow-sm"
              >
                {skill}
              </Badge>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-16">
      <div className="space-y-12 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                My Projects
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Check out my latest work
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I&apos;ve worked on a variety of projects, from simple
                websites to complex web applications. Here are a few of my
                favorites.
              </p>
            </div>
          </div>
        </BlurFade>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
          {DATA.projects.map((project, id) => (
            <BlurFade
              key={project.title}
              delay={BLUR_FADE_DELAY + id * ANIMATION_CONFIG.staggerDelay}
            >
              <ProjectCard
                href={project.href}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

function HackathonsSection() {
  return (
    <section id="hackathons" className="scroll-mt-16">
      <div className="space-y-12 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                Hackathons
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                I like building things
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                During my time in university, I attended{" "}
                {DATA.hackathons.length}+ hackathons. People from around the
                country would come together and build incredible things in 2-3
                days.
              </p>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY}>
          <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
            {DATA.hackathons.map((project, id) => (
              <BlurFade
                key={project.title + project.dates}
                delay={BLUR_FADE_DELAY + id * ANIMATION_CONFIG.staggerDelay}
              >
                <HackathonCard
                  title={project.title}
                  description={project.description}
                  location={project.location}
                  dates={project.dates}
                  image={project.image}
                  links={project.links}
                />
              </BlurFade>
            ))}
          </ul>
        </BlurFade>
      </div>
    </section>
  );
}

// Performance monitoring component - Client-side only
function PerformanceMonitor() {
  // This will be handled by the performance hook when needed
  return null;
}

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <PerformanceMonitor />
        <HeroSection />
        <AboutSection />
        <WorkExperienceSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <HackathonsSection />
        
        {/* Contact section placeholder - can be expanded later */}
        <section id="contact" className="py-12 scroll-mt-16">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Get In Touch</h2>
              <p className="text-muted-foreground mb-6">
                Feel free to reach out if you&apos;d like to collaborate or just say hello!
              </p>
              <Button asChild>
                <Link href={`mailto:${DATA.contact.email}`}>
                  Say Hello
                </Link>
              </Button>
            </div>
          </BlurFade>
        </section>

        {/* Footer with copyright */}
        <footer className="py-8 border-t border-border">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Copyright © 2025 Shivam Yadav
              </p>
            </div>
          </BlurFade>
        </footer>
      </Suspense>
    </main>
  );
}
