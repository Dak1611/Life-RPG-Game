{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // app.js\
\
// --- Initial Skill Trees ---\
const skillData = \{\
  "Mind \uc0\u55358 \u56800 ": ["Philosophy", "Political Theory", "Law", "Vocabulary", "Foreign Languages", "Writing", "History", "Psychology", "Mythology", "Literature", "General Knowledge"],\
  "Artistry \uc0\u55356 \u57256 ": ["Card/Magic Tricks", "Guitar", "Music", "Art", "Cinema", "Anime/Shows", "Poetry"],\
  "Survival & Body \uc0\u9876 \u65039 ": ["Fitness", "Health", "Sports", "Cooking", "Skincare", "Haircare", "Grooming", "Apocalypse Survival"],\
  "Social & Relationships \uc0\u10084 \u65039 ": ["Friendships", "Romance", "Men's Fashion", "Personal Relations", "Local History", "Accessorising"],\
  "Exploration & Play \uc0\u55356 \u57101 ": ["Gaming", "Side Quests", "Owning Stuff", "Eating Things", "Technology"]\
\};\
\
// --- Load or Initialize Save ---\
let save = JSON.parse(localStorage.getItem('lifeRPG')) || \{ xp: \{\}, buffs: [] \};\
\
// Ensure skills exist\
Object.values(skillData).flat().forEach(s => \{\
  if (!save.xp[s]) save.xp[s] = 0;\
\});\
\
// --- Render Skill Trees ---\
function renderSkills() \{\
  const skillTrees = document.getElementById('skill-trees');\
  skillTrees.innerHTML = '';\
  Object.entries(skillData).forEach(([cls, skills]) => \{\
    let div = document.createElement('div');\
    div.innerHTML = `<h2>$\{cls\}</h2>`;\
    skills.forEach(skill => \{\
      let level = Math.floor(save.xp[skill] / 100);\
      let progress = save.xp[skill] % 100;\
      div.innerHTML += `\
        <div class="skill-bar">\
          <div class="skill-level" style="width:$\{progress\}%"></div>\
          <span class="skill-label">$\{skill\} (Lvl $\{level\}) - XP: $\{save.xp[skill]\}</span>\
        </div>`;\
    \});\
    skillTrees.appendChild(div);\
  \});\
\}\
\
// --- XP Logging Form ---\
function setupForm() \{\
  const skillSelect = document.getElementById('skillSelect');\
  Object.values(skillData).flat().forEach(skill => \{\
    let opt = document.createElement('option');\
    opt.value = skill;\
    opt.textContent = skill;\
    skillSelect.appendChild(opt);\
  \});\
\
  document.getElementById('xpForm').onsubmit = function(e) \{\
    e.preventDefault();\
    let skill = skillSelect.value;\
    let type = document.getElementById('xpType').value;\
    let amt = type === 'focus' ? 10 : type === 'quick' ? 5 : 100;\
    save.xp[skill] += amt;\
\
    // Buff sample (random encounter)\
    if (Math.random() < 0.15) \{\
      let buff = \{ text: skill + " Inspiration!", xp: 20, expires: Date.now() + 86400000 \};\
      save.buffs.push(buff);\
      alert("Random Encounter! Buff: " + buff.text + " (+20XP for next session, expires in 24h)");\
    \}\
\
    localStorage.setItem('lifeRPG', JSON.stringify(save));\
    renderSkills();\
    renderBuffs();\
    renderStats();\
    return false;\
  \};\
\}\
\
// --- Render Buffs/Debuffs ---\
function renderBuffs() \{\
  const buffDiv = document.getElementById('buffList');\
  buffDiv.innerHTML = '';\
  save.buffs = save.buffs.filter(buff => Date.now() < buff.expires);\
  save.buffs.forEach(buff => \{\
    buffDiv.innerHTML += `<div>\uc0\u55357 \u56485  $\{buff.text\} (+$\{buff.xp\}XP), expires in $\{Math.ceil((buff.expires-Date.now())/3600000)\}h</div>`;\
  \});\
  localStorage.setItem('lifeRPG', JSON.stringify(save));\
\}\
\
// --- Stats/Profile ---\
function renderStats() \{\
  const statsDiv = document.getElementById('stats');\
  let totalXP = Object.values(save.xp).reduce((a, b) => a + b, 0);\
  statsDiv.innerHTML = `<strong>Total XP: $\{totalXP\}</strong> | Achievements: N/A | Buffs Active: $\{save.buffs.length\}`;\
\}\
\
// --- Init ---\
renderSkills();\
setupForm();\
renderBuffs();\
renderStats();\
}