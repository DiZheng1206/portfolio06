"use client";
import { useEffect, useState } from "react";
import { profile, projects } from "./content";

export default function Home() {
  const [view,setView]=useState<"projects"|"photos"|"about">("projects");
  const [progress,setProgress]=useState(0);
  useEffect(()=>{const update=()=>{const h=document.documentElement.scrollHeight-window.innerHeight;setProgress(h>0?window.scrollY/h*100:0)};update();window.addEventListener("scroll",update,{passive:true});return()=>window.removeEventListener("scroll",update)},[view]);
  const go=(next:typeof view)=>{setView(next);window.scrollTo({top:0,behavior:"smooth"})};
  return <main>
    <div className="progress" style={{transform:`scaleX(${progress/100})`}} />
    <header className="site-header"><button className="wordmark" onClick={()=>go("projects")}>{profile.name}</button><nav aria-label="主导航">{(["projects","photos","about"] as const).map(item=><button key={item} className={view===item?"active":""} onClick={()=>go(item)}>{item==="projects"?"项目":item==="photos"?"照片":"关于"}</button>)}</nav></header>
    {view==="projects"&&<><section className="hero"><h1>{profile.role}。<br/>{profile.location}</h1><a className="scroll-cue" href="#projects"><span>向下滚动</span><b>↓</b></a></section><section id="projects" className="project-list"><p className="eyebrow">精选项目</p>{projects.map(project=><article className="project" key={project.id}><div className="project-head"><h2>{project.title}</h2><p>{project.services}</p><p className="year">{project.year}</p></div><div className="project-info"><p>{project.description}</p><dl><dt>客户：</dt><dd>{project.client}</dd><dt>网站：</dt><dd><a href={project.link} target="_blank" rel="noreferrer">访问项目 ↗</a></dd></dl></div><div className="gallery">{project.images.map((src,i)=><figure key={src} className={i===0?"wide":""}><img src={src} alt={`${project.title} 项目图片 ${i+1}`} loading="lazy"/><figcaption>{project.id}_{String(i+1).padStart(2,"0")}.jpg</figcaption></figure>)}</div></article>)}</section></>}
    {view==="photos"&&<section className="photo-page"><div className="page-title"><p>照片档案</p><h1>一些途中所见，<br/>以及值得停留的瞬间。</h1></div><div className="photo-grid">{projects.flatMap(p=>p.images).map((src,i)=><figure key={`${src}-${i}`}><img src={src} alt={`照片 ${i+1}`} loading="lazy"/><figcaption>PHOTO_{String(i+1).padStart(2,"0")}</figcaption></figure>)}</div></section>}
    {view==="about"&&<section className="about-page"><p className="eyebrow">关于</p><h1>我用设计、图像与代码，<br/>为想法找到准确的形式。</h1><div className="about-grid"><p>这是你的个人介绍区域。你可以写下自己的工作方式、经历、关注的领域，以及正在寻找怎样的合作。所有内容都可以在内容文件中轻松更换。</p><div><p>联系</p><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div></div></section>}
    <footer><button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>回到顶部 ↑</button><span>设计与开发 / {profile.name}</span><span>©{new Date().getFullYear()}</span></footer>
  </main>;
}
