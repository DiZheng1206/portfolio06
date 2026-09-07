"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { profile, projects } from "./content";

const ascii = `                .-=====-.\n             .-'  .---.  '-.\n           .'    /  _  \\    '.\n          /     |  (_)  |     \\\n         |       \\     /       |\n          \\       '---'       /\n           '._    .---.    _.'\n              '--/     \\--'\n          ____.-'       '-.____\n       .-'   /             \\   '-.\n      /_____/               \\_____\\`;

function AsciiLogo(){
  const artRef=useRef<HTMLPreElement>(null);
  useEffect(()=>{
    const image=new Image();
    let frame=0;
    image.src="/logo-source.png";
    image.onload=()=>{
      const cols=108,rows=108;
      const canvas=document.createElement("canvas");
      canvas.width=cols;canvas.height=rows;
      const context=canvas.getContext("2d",{willReadFrequently:true});
      if(!context)return;
          const glyphs="@%#8&$0O*+=-:,.";
      let lastPaint=0;
      const render=(time:number)=>{
        if(time-lastPaint>50){
          lastPaint=time;
          const angle=(time%32000)/32000*Math.PI*2;
          context.clearRect(0,0,cols,rows);
          context.fillStyle="#fff";
          context.fillRect(0,0,cols,rows);
          context.save();
          context.translate(cols/2,rows/2);
          context.scale(Math.cos(angle),1);
          context.drawImage(image,-cols/2,-rows/2,cols,rows);
          context.restore();
          const pixels=context.getImageData(0,0,cols,rows).data;
          let output="";
          for(let y=0;y<rows;y++){
            for(let x=0;x<cols;x++){
              const i=(y*cols+x)*4;
              const light=(pixels[i]+pixels[i+1]+pixels[i+2])/3;
              if(light>230){output+=" ";continue}
              output+=glyphs[Math.min(glyphs.length-1,Math.floor(light/230*glyphs.length))];
            }
            output+="\n";
          }
          if(artRef.current)artRef.current.textContent=output;
        }
        frame=requestAnimationFrame(render);
      };
      frame=requestAnimationFrame(render);
    };
    return ()=>cancelAnimationFrame(frame);
  },[]);
  return <div className="ascii-logo" aria-hidden="true"><pre ref={artRef}/></div>
}

export default function Home(){
  const [view,setView]=useState<"projects"|"photos"|"about">("projects");
  const [expandedImages,setExpandedImages]=useState<Set<string>>(()=>new Set());
  const toggleImage=(key:string)=>{
    const figures=Array.from(document.querySelectorAll<HTMLElement>(".project-gallery figure,.archive-grid figure"));
    const before=new Map(figures.map(figure=>[figure,figure.getBoundingClientRect()]));
    flushSync(()=>setExpandedImages(current=>{const next=new Set(current);next.has(key)?next.delete(key):next.add(key);return next}));
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    figures.forEach(figure=>{
      const first=before.get(figure);
      const last=figure.getBoundingClientRect();
      if(!first||!last.width||!last.height)return;
      const dx=first.left-last.left;
      const dy=first.top-last.top;
      const sx=first.width/last.width;
      const sy=first.height/last.height;
      if(Math.abs(dx)<.5&&Math.abs(dy)<.5&&Math.abs(sx-1)<.005&&Math.abs(sy-1)<.005)return;
      figure.getAnimations().forEach(animation=>animation.cancel());
      figure.animate([
        {transformOrigin:"top left",transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`},
        {transformOrigin:"top left",transform:"translate(0,0) scale(1,1)"}
      ],{duration:1100,easing:"cubic-bezier(.16,1,.3,1)"});
    });
  };
  const go=(next:typeof view)=>{setExpandedImages(new Set());setView(next);window.scrollTo({top:0,behavior:"smooth"})};
  return <main><AsciiLogo/>
    <header className="site-header">
      <button className="wordmark" onClick={()=>go("projects")}><i/>{profile.name}</button><span/>
      <button className={view==="photos"?"active":""} onClick={()=>go("photos")}>work</button>
      <a className="header-email" href="mailto:dideane@163.com">dideane@163.com</a>
    </header>

    {view==="projects"&&<>
      <section className="hero">
        <h1><span>DI ZHENG</span><span>VISUAL DESIGNER</span><span className="hero-year"><img className="hero-silver-logo" src="/silver-logo-transparent.png" alt="DI Zheng silver logo"/><em>2026</em></span></h1>
        <div className="hero-intro"><p>BRAND IDENTITY, INTERACTIVE EXPERIENCES,<br/>DIGITAL DESIGN &amp; VIBE CODING.</p><a href="#projects">VIEW SELECTED WORK ↓</a></div>
      </section>
      <section id="projects" className="project-list"><p className="section-label">work</p>
        {projects.map((project,pIndex)=><article className="project" key={project.id}>
          <div className="project-bar"><h2>{project.title}</h2><strong>{project.services}</strong><b>{project.year}</b><span>×</span></div>
          <div className="project-copy"><p>{project.description}</p>{"deliverables" in project?<div className="project-meta"><p>{project.deliverables}</p><p>{project.client}</p></div>:<dl><dt>client:</dt><dd>{project.client}</dd><dt>website:</dt><dd><a href={project.link} target="_blank" rel="noreferrer">visit project ↗</a></dd><dt>photos:</dt><dd>your name</dd></dl>}</div>
          <div className={`project-gallery project-${project.id} pattern-${pIndex%3}`}>
            {project.images.map((src,i)=>{const imageKey=`project-${project.id}-${i}`;const expanded=expandedImages.has(imageKey);const isVideo=src.endsWith(".mp4");const featured=(project.id==="03"&&i===0)||((project.id==="04"||project.id==="06")&&isVideo);const raised=project.id==="03"&&i===7;const customCaption=project.id==="03"&&i>=1&&i<=3?["ANGRY","FEAR","TIRED"][i-1]:null;const extension=src.split(".").pop()||"jpg";return <figure key={`${src}-${i}`} className={[expanded?"is-expanded":"",featured?"project-media-featured":"",raised?"project-media-raised":""].filter(Boolean).join(" ")} role="button" tabIndex={0} aria-pressed={expanded} onClick={()=>toggleImage(imageKey)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();toggleImage(imageKey)}}}>{isVideo?<video src={src} aria-label={`${project.title} project ${i+1}`} autoPlay muted loop playsInline preload="metadata"/>:<img src={src} alt={`${project.title} project ${i+1}`} loading="lazy"/>}<figcaption>{customCaption??`${project.id.toLowerCase()}_${String(i+1).padStart(3,"0")}.${extension}`}</figcaption></figure>})}
          </div>
        </article>)}
      </section>
    </>}

    {view==="photos"&&<section className="archive"><div className="archive-intro"><h1>work archive</h1><p>selected projects,<br/>details and experiments.</p></div><div className="archive-grid">{projects.flatMap(p=>[...p.images,...p.images]).map((src,i)=>{const imageKey=`archive-${i}`;const expanded=expandedImages.has(imageKey);const isVideo=src.endsWith(".mp4");const extension=src.split(".").pop()||"jpg";return <figure key={`${src}-${i}`} className={expanded?"is-expanded":""} role="button" tabIndex={0} aria-pressed={expanded} onClick={()=>toggleImage(imageKey)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();toggleImage(imageKey)}}}>{isVideo?<video src={src} aria-label={`archive ${i+1}`} autoPlay muted loop playsInline preload="metadata"/>:<img src={src} alt={`archive ${i+1}`} loading="lazy"/>}<figcaption>work_{String(i+1).padStart(3,"0")}.{extension}</figcaption></figure>})}</div></section>}

    {view==="about"&&<section className="about-screen"><div><p>about</p><h1>i build identities,<br/>images and digital<br/>experiences.</h1></div><aside><p>这是你的个人介绍区域。可以在 content.ts 中修改姓名、项目、联系方式与全部图片。</p><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.instagram}>instagram ↗</a></aside></section>}
    <footer><button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>↑ top</button><span>design & development by {profile.name}</span><span>©{new Date().getFullYear()}</span></footer>
  </main>
}
