"use client";
import { useEffect, useRef, useState } from "react";
import { profile, projects } from "./content";

const ascii = `                .-=====-.\n             .-'  .---.  '-.\n           .'    /  _  \\    '.\n          /     |  (_)  |     \\\n         |       \\     /       |\n          \\       '---'       /\n           '._    .---.    _.'\n              '--/     \\--'\n          ____.-'       '-.____\n       .-'   /             \\   '-.\n      /_____/               \\_____\\`;

function AsciiLogo(){
  const artRef=useRef<HTMLPreElement>(null);
  useEffect(()=>{
    const image=new Image();
    let frame=0;
    image.src="/logo-source.png";
    image.onload=()=>{
      const cols=74,rows=74;
      const canvas=document.createElement("canvas");
      canvas.width=cols;canvas.height=rows;
      const context=canvas.getContext("2d",{willReadFrequently:true});
      if(!context)return;
      const glyphs="@%#*+=-:.";
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
  const go=(next:typeof view)=>{setView(next);window.scrollTo({top:0,behavior:"smooth"})};
  return <main><AsciiLogo/>
    <header className="site-header">
      <button className="wordmark" onClick={()=>go("projects")}><i/>{profile.name}</button><span/>
      <button className={view==="photos"?"active":""} onClick={()=>go("photos")}>work</button>
      <button className={view==="about"?"active":""} onClick={()=>go("about")}>about</button>
    </header>

    {view==="projects"&&<>
      <section className="hero"><h1><span>Di zheng Portfolio,</span><span>Visual Designer</span><span>2026</span></h1></section>
      <section id="projects" className="project-list"><p className="section-label">work</p>
        {projects.map((project,pIndex)=><article className="project" key={project.id}>
          <div className="project-bar"><h2>{project.title}</h2><strong>{project.services}</strong><b>{project.year}</b><span>×</span></div>
          <div className="project-copy"><p>{project.description}</p><dl><dt>client:</dt><dd>{project.client}</dd><dt>website:</dt><dd><a href={project.link} target="_blank" rel="noreferrer">visit project ↗</a></dd><dt>photos:</dt><dd>your name</dd></dl></div>
          <div className={`project-gallery pattern-${pIndex%3}`}>
            {(project.images.length>=6?project.images:[...project.images,...project.images]).map((src,i)=><figure key={`${src}-${i}`}><img src={src} alt={`${project.title} project ${i+1}`} loading="lazy"/><figcaption>{project.id.toLowerCase()}_{String(i+1).padStart(3,"0")}.jpg</figcaption></figure>)}
          </div>
        </article>)}
      </section>
    </>}

    {view==="photos"&&<section className="archive"><div className="archive-intro"><h1>work archive</h1><p>selected projects,<br/>details and experiments.</p></div><div className="archive-grid">{projects.flatMap(p=>[...p.images,...p.images]).map((src,i)=><figure key={`${src}-${i}`}><img src={src} alt={`archive ${i+1}`} loading="lazy"/><figcaption>work_{String(i+1).padStart(3,"0")}.jpg</figcaption></figure>)}</div></section>}

    {view==="about"&&<section className="about-screen"><div><p>about</p><h1>i build identities,<br/>images and digital<br/>experiences.</h1></div><aside><p>这是你的个人介绍区域。可以在 content.ts 中修改姓名、项目、联系方式与全部图片。</p><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.instagram}>instagram ↗</a></aside></section>}
    <footer><button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>↑ top</button><span>design & development by {profile.name}</span><span>©{new Date().getFullYear()}</span></footer>
  </main>
}
