(() => {
  const entryReferrer = document.referrer || '';
  const openedFromSurvey = !!entryReferrer && !entryReferrer.includes(location.host);
  const openedInNewTab = !!window.opener;
  const canRestoreSurveyHistory = history.length > 1 && (!entryReferrer || openedFromSurvey);

  let returnStarted = false;
  let returnLogIndex = -1;
  let returnBackdrop;
  let returnMessage;

  function elapsedSinceLoad() {
    return Math.round(performance.now());
  }

  function writeReturnLog(mode) {
    log('return_to_survey', {
      condition: getCondition(),
      return_mode: mode,
      elapsed: elapsedSinceLoad()
    });
    const rows = JSON.parse(localStorage.getItem('rv2717_log') || '[]');
    returnLogIndex = rows.length - 1;
  }

  function updateReturnLogMode(mode) {
    if (returnLogIndex < 0) return;
    const rows = JSON.parse(localStorage.getItem('rv2717_log') || '[]');
    const row = rows[returnLogIndex];
    if (!row || row.type !== 'return_to_survey') return;
    row.data.return_mode = mode;
    row.data.elapsed = elapsedSinceLoad();
    localStorage.setItem('rv2717_log', JSON.stringify(rows));
    window.__RV2717_LOG__ = rows;
  }

  function showManualReturn() {
    if (!returnBackdrop) return;
    updateReturnLogMode('manual');
    returnMessage.textContent = 'Please return to the SurveyCake questionnaire you were using before this page. Do not open a new plain SurveyCake link, because it may restart the questionnaire at Page 1.';
    returnBackdrop.classList.add('open');
    const backButton = document.getElementById('returnSurveyTryBack');
    if (backButton) backButton.focus();
  }

  function safeFallback() {
    showManualReturn();
  }

  function attemptClose() {
    window.close();
    setTimeout(() => {
      if (!document.hidden) safeFallback();
    }, 700);
  }

  function attemptBack() {
    history.back();
    setTimeout(() => {
      if (!document.hidden) safeFallback();
    }, 900);
  }

  function returnMode() {
    if (openedInNewTab) return 'close-opener';
    if (canRestoreSurveyHistory) return 'history-back';
    return 'manual';
  }

  function returnToSurvey() {
    const mode = returnMode();
    writeReturnLog(mode);
    if (mode === 'close-opener') {
      attemptClose();
      return;
    }
    if (mode === 'history-back') {
      attemptBack();
      return;
    }
    showManualReturn();
  }

  function installStyles() {
    if (document.getElementById('rvReturnStyles')) return;
    const style = document.createElement('style');
    style.id = 'rvReturnStyles';
    style.textContent = `
      .rv-return-area{margin-top:24px;padding-top:20px;border-top:1px solid var(--line-dark);display:flex;justify-content:flex-end}
      .rv-return-button{border:1px solid var(--deep);background:var(--deep);color:#fff;padding:12px 18px;min-width:230px;font-weight:700;font-size:13px;letter-spacing:.02em;cursor:pointer}
      .rv-return-button:hover{filter:brightness(1.08)}
      .rv-return-button:focus-visible,.rv-return-action:focus-visible{outline:3px solid rgba(34,38,41,.25);outline-offset:3px}
      .rv-return-button:disabled{opacity:.68;cursor:default}
      .rv-return-backdrop{display:none;position:fixed;inset:0;z-index:120;background:rgba(20,20,20,.78);align-items:center;justify-content:center;padding:24px}
      .rv-return-backdrop.open{display:flex}
      .rv-return-panel{width:min(560px,100%);background:var(--paper);border:1px solid var(--line-dark);box-shadow:0 30px 80px rgba(0,0,0,.35);padding:26px;text-align:center}
      .rv-return-panel h2{font-family:Georgia,serif;font-size:28px;line-height:1.2;margin:0 0 12px}
      .rv-return-panel p{margin:0 auto;color:#414446;max-width:48ch}
      .rv-return-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:20px}
      .rv-return-action{border:1px solid var(--line-dark);background:var(--paper);color:var(--ink);padding:10px 15px;font-weight:700;font-size:13px;cursor:pointer}
      .rv-return-action.primary{background:var(--deep);border-color:var(--deep);color:#fff}
      @media(max-width:620px){.rv-return-area{justify-content:stretch}.rv-return-button{width:100%}.rv-return-panel{padding:22px 18px}}
    `;
    document.head.appendChild(style);
  }

  function installReturnUI() {
    const reviewComplete = document.querySelector('#finding .review-complete');
    if (!reviewComplete || document.getElementById('returnToSurveyButton')) return;

    installStyles();

    const area = document.createElement('div');
    area.className = 'rv-return-area';
    area.innerHTML = '<button class="rv-return-button" id="returnToSurveyButton" type="button">Continue to questionnaire</button>';
    reviewComplete.insertAdjacentElement('afterend', area);

    returnBackdrop = document.createElement('div');
    returnBackdrop.className = 'rv-return-backdrop';
    returnBackdrop.id = 'returnSurveyBackdrop';
    returnBackdrop.setAttribute('role', 'dialog');
    returnBackdrop.setAttribute('aria-modal', 'true');
    returnBackdrop.setAttribute('aria-labelledby', 'returnSurveyTitle');
    returnBackdrop.innerHTML = `
      <section class="rv-return-panel">
        <h2 id="returnSurveyTitle">Return to the questionnaire</h2>
        <p id="returnSurveyMessage">Please return to the questionnaire you were using before this page.</p>
        <div class="rv-return-actions">
          <button class="rv-return-action primary" id="returnSurveyTryBack" type="button">Go back</button>
          <button class="rv-return-action" id="returnSurveyTryClose" type="button">Close this tab</button>
        </div>
      </section>`;
    document.body.appendChild(returnBackdrop);
    returnMessage = document.getElementById('returnSurveyMessage');

    const returnButton = document.getElementById('returnToSurveyButton');
    returnButton.addEventListener('click', () => {
      if (returnStarted) return;
      returnStarted = true;
      returnButton.disabled = true;
      returnToSurvey();
    });

    document.getElementById('returnSurveyTryBack').addEventListener('click', () => {
      if (history.length > 1) attemptBack();
      else safeFallback();
    });
    document.getElementById('returnSurveyTryClose').addEventListener('click', attemptClose);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installReturnUI);
  } else {
    installReturnUI();
  }
})();