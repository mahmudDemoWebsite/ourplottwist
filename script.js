const screens = {
  intro: document.getElementById('introScreen'),
  proposal: document.getElementById('proposalScreen'),
  planner: document.getElementById('plannerScreen'),
  invite: document.getElementById('inviteScreen')
};

const stepCount = document.getElementById('stepCount');
const fromNameInput = document.getElementById('fromName');
const toNameInput = document.getElementById('toName');
const letterArt = document.querySelector('.letter-art');
const playground = document.getElementById('answerPlayground');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const playfulNote = document.getElementById('playfulNote');
const confettiLayer = document.getElementById('confettiLayer');

let fromName = '';
let toName = '';
let noDodges = 0;
let noMoveCooldown = false;
let noHasTurnedIntoYes = false;

const playfulMessages = [
  'OOP—NOPE. That button has places to be. 😭',
  'The NO button just unlocked teleportation. 🌀',
  'It saw your cursor and chose cardio. 🏃💨',
  'Error 404: NO button not found. Please try catching feelings. 😂',
  'This button has a black belt in hide-and-seek. 🥋',
  'Plot twist: the button is freelancing as a moving target. 🎯',
  'Your cursor: 👆  The NO button: 🏃‍♂️💨',
  'The NO button called its lawyer. It refuses to stay still. ⚖️😂'
];

function showScreen(screenName, step) {
  Object.entries(screens).forEach(([name, screen]) => {
    const isActive = name === screenName;
    screen.hidden = !isActive;
    screen.classList.toggle('active', isActive);
  });
  stepCount.innerHTML = `${String(step).padStart(2, '0')} <i>/ 03</i>`;
  document.querySelector('.experience-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getGreetingName() {
  return toName ? `${toName},` : 'hey you,';
}

function startProposal() {
  fromName = fromNameInput.value.trim();
  toName = toNameInput.value.trim();
  const heading = document.getElementById('questionHeading');
  heading.textContent = `${getGreetingName()} can I make a little memory with you?`;
  document.getElementById('questionLead').textContent = 'Will you go on a date with me?';
  noDodges = 0;
  noMoveCooldown = false;
  noHasTurnedIntoYes = false;
  noBtn.classList.remove('is-yes');
  noBtn.textContent = 'NO 🙈';
  noBtn.setAttribute('aria-label', 'Try to click No');
  noBtn.style.left = '';
  noBtn.style.top = '';
  yesBtn.style.transform = '';
  playfulNote.textContent = 'The NO button has trust issues. Try catching it. 😂';
  showScreen('proposal', 2);
  requestAnimationFrame(positionButtonsForStart);
}

function positionButtonsForStart() {
  const width = playground.clientWidth;
  const noWidth = noBtn.offsetWidth;
  const isMobile = width < 500;
  yesBtn.style.left = `${isMobile ? 14 : Math.max(24, width * 0.20)}px`;
  yesBtn.style.top = `${isMobile ? 28 : 52}px`;
  noBtn.style.left = `${isMobile ? Math.max(14, width - noWidth - 14) : Math.min(width - noWidth - 24, width * 0.59)}px`;
  noBtn.style.top = `${isMobile ? 94 : 52}px`;
}

function moveNoButton() {
  if (noMoveCooldown || noHasTurnedIntoYes || playground.clientWidth < 10) return;
  noMoveCooldown = true;
  window.setTimeout(() => { noMoveCooldown = false; }, 170);

  const maxX = Math.max(8, playground.clientWidth - noBtn.offsetWidth - 8);
  const maxY = Math.max(8, playground.clientHeight - noBtn.offsetHeight - 8);
  const oldX = Number.parseFloat(noBtn.style.left) || noBtn.offsetLeft;
  const oldY = Number.parseFloat(noBtn.style.top) || noBtn.offsetTop;
  let x = oldX;
  let y = oldY;

  // Pick a new position inside the playground and avoid leaving the button where it was.
  for (let tries = 0; tries < 18; tries += 1) {
    x = Math.round(8 + Math.random() * Math.max(0, maxX - 8));
    y = Math.round(8 + Math.random() * Math.max(0, maxY - 8));
    const farEnough = Math.abs(x - oldX) > 50 || Math.abs(y - oldY) > 26;
    const overlapsYes = !(
      x + noBtn.offsetWidth < yesBtn.offsetLeft ||
      x > yesBtn.offsetLeft + yesBtn.offsetWidth ||
      y + noBtn.offsetHeight < yesBtn.offsetTop ||
      y > yesBtn.offsetTop + yesBtn.offsetHeight
    );
    if (farEnough && !overlapsYes) break;
  }

  noBtn.style.left = `${Math.min(maxX, x)}px`;
  noBtn.style.top = `${Math.min(maxY, y)}px`;
  noDodges += 1;
  playfulNote.textContent = playfulMessages[(noDodges - 1) % playfulMessages.length];
  yesBtn.style.transform = `scale(${Math.min(1.13, 1 + noDodges * 0.012)})`;
}

function handleNoPointerEnter() {
  if (!noHasTurnedIntoYes) moveNoButton();
}

function convertNoIntoYes() {
  if (noHasTurnedIntoYes) return;
  noHasTurnedIntoYes = true;
  noBtn.removeEventListener('pointerenter', handleNoPointerEnter);
  noBtn.classList.add('is-yes');
  noBtn.textContent = 'YES?! 😂';
  noBtn.setAttribute('aria-label', 'Yes, let us plan a date');
  noBtn.style.left = `${Math.max(8, (playground.clientWidth - noBtn.offsetWidth) / 2)}px`;
  noBtn.style.top = `${Math.max(8, (playground.clientHeight - noBtn.offsetHeight) / 2)}px`;
  playfulNote.textContent = 'PLOT TWIST! 😂 The NO button glitched into YES. Opening the date planner…';
  yesBtn.style.transform = '';
  window.setTimeout(openPlanner, 850);
}

function openPlanner() {
  document.getElementById('dateName').value = toName;
  document.getElementById('dateFrom').value = fromName;
  showScreen('planner', 3);
  celebrate();
}

function setMinDate() {
  const dateInput = document.getElementById('dateInput');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const toLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  dateInput.min = toLocalDateString(today);
  if (!dateInput.value) dateInput.value = toLocalDateString(tomorrow);
}

function formatDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

function formatTime(timeValue) {
  const [hours, minutes] = timeValue.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date);
}

function createInvitation(event) {
  event.preventDefault();
  const dateName = document.getElementById('dateName').value.trim();
  const invitedBy = document.getElementById('dateFrom').value.trim();
  const dateValue = document.getElementById('dateInput').value;
  const timeValue = document.getElementById('timeInput').value;
  const placeValue = document.getElementById('placeInput').value.trim();
  const vibe = document.querySelector('input[name="vibe"]:checked').value;

  if (!dateName || !invitedBy || !dateValue || !timeValue) return;
  if (dateValue < document.getElementById('dateInput').min) {
    document.getElementById('dateInput').setCustomValidity('Pick today or a future date, please.');
    document.getElementById('dateInput').reportValidity();
    document.getElementById('dateInput').setCustomValidity('');
    return;
  }

  document.getElementById('inviteTo').textContent = dateName;
  document.getElementById('inviteFrom').textContent = invitedBy;
  document.getElementById('inviteDate').textContent = formatDate(dateValue);
  document.getElementById('inviteTime').textContent = formatTime(timeValue);
  document.getElementById('inviteVibe').textContent = vibe;
  document.getElementById('invitePlace').textContent = placeValue || 'Somewhere lovely';
  document.getElementById('copyStatus').textContent = '';
  showScreen('invite', 3);
  celebrate();

  if (navigator.share) document.getElementById('shareInviteBtn').hidden = false;
}

function invitationText() {
  const to = document.getElementById('inviteTo').textContent;
  const from = document.getElementById('inviteFrom').textContent;
  const date = document.getElementById('inviteDate').textContent;
  const time = document.getElementById('inviteTime').textContent;
  const vibe = document.getElementById('inviteVibe').textContent;
  const place = document.getElementById('invitePlace').textContent;
  return `💌 OUR LITTLE DATE\n\nDear ${to},\nI'd love to spend a little time with you. It's a date! ♡\n\n📅 When: ${date}\n🕰️ Time: ${time}\n✨ The vibe: ${vibe}\n📍 Meet me at: ${place}\n\nCan't wait, ${from} ♡`;
}

async function copyInvitation() {
  const status = document.getElementById('copyStatus');
  const text = invitationText();
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      const copied = document.execCommand('copy');
      temp.remove();
      if (!copied) throw new Error('Copy was not available');
    }
    status.textContent = 'Copied! Now send a little plot twist. 💌';
  } catch (error) {
    status.textContent = 'Copy was blocked by this browser. You can select the invite text manually.';
  }
}

async function shareInvitation() {
  if (!navigator.share) return;
  try {
    await navigator.share({ title: 'Our little date 💌', text: invitationText() });
  } catch (error) {
    // A dismissed share sheet is not an error the visitor needs to see.
  }
}

function celebrate() {
  confettiLayer.replaceChildren();
  const decorations = ['♡', '✦', '♥', '✧', '✿'];
  for (let i = 0; i < 34; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.textContent = decorations[Math.floor(Math.random() * decorations.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty('--size', `${10 + Math.random() * 17}px`);
    piece.style.setProperty('--duration', `${2.4 + Math.random() * 2.2}s`);
    piece.style.setProperty('--delay', `${Math.random() * .75}s`);
    piece.style.setProperty('--drift', `${Math.round(Math.random() * 180 - 90)}px`);
    piece.style.color = ['#e96ea9', '#b77ad1', '#f0b0cf', '#dca8df', '#f4c2dc'][Math.floor(Math.random() * 5)];
    confettiLayer.appendChild(piece);
  }
  window.setTimeout(() => confettiLayer.replaceChildren(), 5500);
}

function restartStory() {
  fromNameInput.value = '';
  toNameInput.value = '';
  fromName = '';
  toName = '';
  noDodges = 0;
  noMoveCooldown = false;
  noHasTurnedIntoYes = false;
  noBtn.classList.remove('is-yes');
  noBtn.textContent = 'NO 🙈';
  noBtn.setAttribute('aria-label', 'Try to click No');
  noBtn.removeEventListener('pointerenter', handleNoPointerEnter);
  noBtn.addEventListener('pointerenter', handleNoPointerEnter);
  noBtn.style.left = '';
  noBtn.style.top = '';
  yesBtn.style.transform = '';
  confettiLayer.replaceChildren();
  letterArt.classList.remove('is-opening');
  playfulNote.textContent = 'The NO button has trust issues. Try catching it. 😂';
  showScreen('intro', 1);
}

document.getElementById('openLetterBtn').addEventListener('click', () => {
  letterArt.classList.add('is-opening');
  window.setTimeout(startProposal, 360);
});

yesBtn.addEventListener('click', openPlanner);
noBtn.addEventListener('pointerenter', handleNoPointerEnter);
noBtn.addEventListener('click', convertNoIntoYes);
document.getElementById('dateForm').addEventListener('submit', createInvitation);
document.getElementById('copyInviteBtn').addEventListener('click', copyInvitation);
document.getElementById('shareInviteBtn').addEventListener('click', shareInvitation);
document.getElementById('restartBtn').addEventListener('click', restartStory);

window.addEventListener('resize', () => {
  if (!screens.proposal.hidden && !noHasTurnedIntoYes) positionButtonsForStart();
});

setMinDate();
