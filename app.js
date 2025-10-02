// app.js

// --- Initial Skill Trees ---
const skillData = {
  "Mind 🧠": ["Philosophy", "Political Theory", "Law", "Vocabulary", "Foreign Languages", "Writing", "History", "Psychology", "Mythology", "Literature", "General Knowledge"],
  "Artistry 🎨": ["Card/Magic Tricks", "Guitar", "Music", "Art", "Cinema", "Anime/Shows", "Poetry"],
  "Survival & Body ⚔️": ["Fitness", "Health", "Sports", "Cooking", "Skincare", "Haircare", "Grooming", "Apocalypse Survival"],
  "Social & Relationships ❤️": ["Friendships", "Romance", "Men's Fashion", "Personal Relations", "Local History", "Accessorising"],
  "Exploration & Play 🌍": ["Gaming", "Side Quests", "Owning Stuff", "Eating Things", "Technology"]
};

let save = JSON.parse(localStorage.getItem('lifeRPG')) || { xp: {}, buffs: [] };

Object.values(skillData).flat().forEach(s => {
  if (!save.xp[s]) save.xp[s] = 0;
});

function renderSkills() {
  const skillTrees = document.getElementById('skill-trees');
  skillTrees.innerHTML = '';
  Object.entries(skillData).forEach(([cls, skills]) => {
    let div = document.createElement('div');
    div.innerHTML = `<h2>${cls}</h2>`;
    skills.forEach(skill => {
      let level = Math.floor(save.xp[skill] / 100);
      let progress = save.xp[skill] % 100;
      div.innerHTML += `
        <div class="skill-bar">
          <div class="skill-level" style="width:${progress}%"></div>
          <span class="skill-label">${skill} (Lvl ${level}) - XP: ${save.xp[skill]}</span>
        </div>`;
    });
    skillTrees.appendChild(div);
  });
}

function setupForm() {
  const skillSelect = document.getElementById('skillSelect');
  Object.values(skillData).flat().forEach(skill => {
    let opt = document.createElement('option');
    opt.value = skill;
    opt.textContent = skill;
    skillSelect.appendChild(opt);
  });

  document.getElementById('xpForm').onsubmit = function(e) {
    e.preventDefault();
    let skill = skillSelect.value;
    let type = document.getElementById('xpType').value;
    let amt = type === 'focus' ? 10 : type === 'quick' ? 5 : 100;
    save.xp[skill] += amt;

    if (Math.random() < 0.15) {
      let buff = { text: skill + " Inspiration!", xp: 20, expires: Date.now() + 86400000 };
      save.buffs.push(buff);
      alert("Random Encounter! Buff: " + buff.text + " (+20XP for next session, expires in 24h)");
    }

    localStorage.setItem('lifeRPG', JSON.stringify(save));
    renderSkills();
    renderBuffs();
    renderStats();
    return false;
  };
}

function renderBuffs() {
  const buffDiv = document.getElementById('buffList');
  buffDiv.innerHTML = '';
  save.buffs = save.buffs.filter(buff => Date.now() < buff.expires);
  save.buffs.forEach(buff => {
    buffDiv.innerHTML += `<div>💥 ${buff.text} (+${buff.xp}XP), expires in ${Math.ceil((buff.expires-Date.now())/3600000)}h</div>`;
  });
  localStorage.setItem('lifeRPG', JSON.stringify(save));
}

function renderStats() {
  const statsDiv = document.getElementById('stats');
  let totalXP = Object.values(save.xp).reduce((a, b) => a + b, 0);
  statsDiv.innerHTML = `<strong>Total XP: ${totalXP}</strong> | Achievements: N/A | Buffs Active: ${save.buffs.length}`;
}

renderSkills();
setupForm();
renderBuffs();
renderStats();
