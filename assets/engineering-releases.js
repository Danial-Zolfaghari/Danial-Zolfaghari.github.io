/* Loads *published releases*, not commits. Fail closed when GitHub is unavailable. */
(()=>{
"use strict";
const owner="Danial-Zolfaghari";
const repos=["ProcDomainSniffer","TunnelGate","DZ-Operations-Console","ELK-Checker","Round-Robin"];
const root=document.getElementById("release-list");
if(!root)return;
async function load(repo){
  // The links and repository names exist in static HTML for SEO and no-JS access.
  const card=Array.from(root.querySelectorAll("article[data-repo]")).find(el=>el.dataset.repo===repo);
  if(!card)return;
  const status=card.querySelector(".state");
  const link=card.querySelector("a");
  if(!status||!link)return;
  status.textContent="Checking published releases…";
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
