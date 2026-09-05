"use client";
import { useState } from "react";
import { profile, projects } from "./content";

const ascii = `                .-=====-.\n             .-'  .---.  '-.\n           .'    /  _  \\    '.\n          /     |  (_)  |     \\\n         |       \\     /       |\n          \\       '---'       /\n           '._    .---.    _.'\n              '--/     \\--'\n          ____.-'       '-.____\n       .-'   /             \\   '-.\n      /_____/               \\_____\\`;

export default function Home(){
  const [view,setView]=useState<"projects"|"photos"|"about">("projects");
  const go=(next:typeof view)=>{setView(next);window.scrollTo({top:0,behavior:"smooth"})};
  return <main>
    <header className="site-header">
      <button className="wordmark" onClick={()=>go("projects")}><i/>{profile.name}</button><span/>
      <button className={view==="photos"?"active":""} onClick={()=>go("photos")}>photos</button>
      <button className={view==="about"?"active":""} onClick={()=>go("about")}>about</button>
    </header>

    {view==="projects"&&<>
      <section className="hero"><pre className="ascii" aria-hidden="true">{ascii}</pre><h1>swiss based web and<br/>brand designer. currently open<br/>for a new position.</h1><a className="scroll-cue" href="#projects"><span>scroll down</span><b>↓</b></a></section>
      <section id="projects" className="project-list"><p className="section-label">projects</p>
        {projects.map((project,pIndex)=><article className="project" key={project.id}>
          <div className="project-bar"><h2>{project.title}</h2><strong>{project.services}</strong><b>{project.year}</b><span>×</span></div>
          <div className="project-copy"><p>{project.description}</p><dl><dt>client:</dt><dd>{project.client}</dd><dt>website:</dt><dd><a href={project.link} target="_blank" rel="noreferrer">visit project ↗</a></dd><dt>photos:</dt><dd>your name</dd></dl></div>
          <div className={`project-gallery pattern-${pIndex%3}`}>
            {[...project.images,...project.images].map((src,i)=><figure key={`${src}-${i}`}><img src={src} alt={`${project.title} project ${i+1}`} loading="lazy"/><figcaption>{project.id.toLowerCase()}_{String(i+1).padStart(3,"0")}.jpg</figcaption></figure>)}
          </div>
        </article>)}
      </section>
    </>}

    {view==="photos"&&<section className="archive"><div className="archive-intro"><pre>{ascii}</pre><h1>photo archive</h1><p>fragments, observations<br/>and work in progress.</p></div><div className="archive-grid">{projects.flatMap(p=>[...p.images,...p.images]).map((src,i)=><figure key={`${src}-${i}`}><img src={src} alt={`archive ${i+1}`} loading="lazy"/><figcaption>ph_{String(i+1).padStart(3,"0")}.jpg</figcaption></figure>)}</div></section>}

    {view==="about"&&<section className="about-screen"><pre>{ascii}</pre><div><p>about</p><h1>i build identities,<br/>images and digital<br/>experiences.</h1></div><aside><p>这是你的个人介绍区域。可以在 content.ts 中修改姓名、项目、联系方式与全部图片。</p><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.instagram}>instagram ↗</a></aside></section>}
    <footer><button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>↑ top</button><span>design & development by {profile.name}</span><span>©{new Date().getFullYear()}</span></footer>
  </main>
}
