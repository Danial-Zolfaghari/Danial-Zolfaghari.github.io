/* Loads *published releases*, not commits. Fail closed when GitHub is unavailable. */
(()=>{
"use strict";
const owner="Danial-Zolfaghari";
const repos=["ProcDomainSniffer","TunnelGate","DZ-Operations-Console","ELK-Checker","Round-Robin"];
const root=document.getElementById("release-list");
if(!root)return;
const make=(tag,text,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e};
async function load(repo){
  const card=make("article",null,"repo");
  const h=make("h3",repo);card.appendChild(h);
  const status=make("p","Checking published releases…","state");card.appendChild(status);
  const link=make("a","View repository releases ↗");
  link.href="https://github.com/"+owner+"/"+repo+"/releases";
  link.rel="noopener noreferrer";card.appendChild(link);
  root.appendChild(card);
  try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),6500);
    let response;
    try{response=await fetch("https://api.github.com/repos/"+encodeURIComponent(owner)+"/"+encodeURIComponent(repo)+"/releases/latest",{headers:{Accept:"application/vnd.github+json"},signal:controller.signal})}
    finally{clearTimeout(timeout)}
    if(response.status===404){status.textContent="No stable release is exposed by the latest-release API.";return}
    if(!response.ok)throw Error("GitHub API temporarily unavailable");
    const data=await response.json();
    if(typeof data.tag_name!=="string"||!data.tag_name.trim())throw Error("Missing release metadata");
    status.textContent="Latest stable release: "+data.tag_name+" · "+(data.published_at?new Date(data.published_at).toLocaleDateString("en-GB",{year:"numeric",month:"short",day:"numeric"}):"Published on GitHub");
    if(typeof data.html_url==="string"&&data.html_url.startsWith("https://github.com/"+owner+"/"+repo+"/releases/")){
      link.href=data.html_url;link.textContent="View this release ↗";
    }
  }catch(e){status.textContent="Live release details unavailable. Open GitHub for current information."}
}
for(const name of repos)load(name);
})();
