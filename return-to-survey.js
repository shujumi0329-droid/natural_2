(() => {
  const entryReferrer = document.referrer || '';
  const openedFromSurvey = !!entryReferrer && !entryReferrer.includes(location.host);
  const openedInNewTab = !!window.opener;
  const userAgent = navigator.userAgent || '';
  const isSafari = /Safari/i.test(userAgent) && !/(Chrome|Chromium|CriOS|FxiOS|EdgiOS|OPiOS|Android)/i.test(userAgent);
  const canRestoreSurveyHistory = !isSafari && history.length > 1 && (!entryReferrer || openedFromSurvey);

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

    const backButton = document.getElementById('returnSurveyTryBack');
    const closeButton = document.getElementById('returnSurveyTryClose');

    if (isSafari) {
      returnMessage.textContent = 'Safari may reload SurveyCake when the browser Back button is used. Please do not use Back. If the questionnaire is still open in another tab, switch to that tab. You can also try closing this manipulation tab.';
      if (backButton) backButton.hidden = true;
      if (closeButton) closeButton.textContent = 'Close this tab';
    } else {
      returnMessage.textContent = 'Please return to the SurveyCake questionnaire you were using before this page. Do not open a new plain SurveyCake link, because it may restart the questionnaire at Page 1.';
      if (backButton) backButton.hidden = false;
    }

    returnBackdrop.classList.add('open');
    const focusTarget = isSafari ? closeButton : backButton;
    if (focusTarget) focusTarget.focus();
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
    if (isSafari) {
      safeFallback();
      return;
    }
    history.back();
    setTimeout(() => {
      if (!document.hidden) safeFallback();
    }, 900);
  }

  function returnMode() {
    if (openedInNewTab) return 'close-opener';
    if (isSafari) return 'close-safari';
    if (canRestoreSurveyHistory) return 'history-back';
    return 'manual';
  }

  function returnToSurvey() {
    const mode = returnMode();
    writeReturnLog(mode);
    if (mode === 'close-opener' || mode === 'close-safari') {
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
      .rv-return-area{margin-top:28px}
      .rv-return-card{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:18px;align-items:center;padding:20px 22px;border:1px solid var(--line-dark);background:linear-gradient(135deg,#f2efe8 0%,#f8f6f1 100%);overflow:hidden}
      .rv-return-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--deep)}
      .rv-return-mark{width:42px;height:42px;border:1px solid var(--deep);display:grid;place-items:center;font-family:Georgia,serif;font-size:24px;line-height:1;color:var(--deep);background:var(--paper)}
      .rv-return-copy{min-width:0}
      .rv-return-kicker{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
      .rv-return-copy h3{font-family:Georgia,serif;font-size:23px;line-height:1.15;margin:0 0 6px;font-weight:700}
      .rv-return-copy p{margin:0;color:#55595b;font-size:13px;max-width:680px}
      .rv-return-copy p strong{color:var(--ink);font-weight:700}
      .rv-return-button{border:1px solid var(--deep);background:var(--deep);color:#fff;padding:12px 16px 12px 18px;min-width:224px;display:inline-flex;align-items:center;justify-content:center;gap:14px;font-weight:700;font-size:13px;letter-spacing:.02em;cursor:pointer;white-space:nowrap;box-shadow:0 7px 18px rgba(34,38,41,.13);transition:transform .16s ease,box-shadow .16s ease,background .16s ease}
      .rv-return-button .rv-return-arrow{font-family:Georgia,serif;font-size:18px;line-height:1;transition:transform .16s ease}
      .rv-return-button:hover{background:#111416;transform:translateY(-1px);box-shadow:0 10px 22px rgba(34,38,41,.18)}
      .rv-return-button:hover .rv-return-arrow{transform:translateX(3px)}
      .rv-return-button:focus-visible,.rv-return-action:focus-visible{outline:3px solid rgba(34,38,41,.24);outline-offset:3px}
      .rv-return-button:disabled{opacity:.68;cursor:default;transform:none;box-shadow:none}
      .rv-return-backdrop{display:none;position:fixed;inset:0;z-index:120;background:rgba(20,20,20,.78);align-items:center;justify-content:center;padding:24px}
      .rv-return-backdrop.open{display:flex}
      .rv-return-panel{position:relative;width:min(570px,100%);background:var(--paper);border:1px solid var(--line-dark);box-shadow:0 30px 80px rgba(0,0,0,.35);padding:28px;text-align:left;overflow:hidden}
      .rv-return-panel::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--deep)}
      .rv-return-modal-kicker{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin-bottom:7px}
      .rv-return-panel h2{font-family:Georgia,serif;font-size:29px;line-height:1.16;margin:0 0 12px}
      .rv-return-panel p{margin:0;color:#414446;max-width:50ch}
      .rv-return-safety{margin-top:16px;padding:11px 13px;border-left:3px solid var(--deep);background:var(--soft);font-size:12px;color:#505355}
      .rv-return-actions{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:22px}
      .rv-return-action{border:1px solid var(--line-dark);background:var(--paper);color:var(--ink);padding:10px 15px;font-weight:700;font-size:13px;cursor:pointer}
      .rv-return-action.primary{background:var(--deep);border-color:var(--deep);color:#fff}
      @media(max-width:760px){.rv-return-card{grid-template-columns:auto 1fr}.rv-return-button{grid-column:1/-1;width:100%}}
      @media(max-width:620px){.rv-return-area{margin-top:22px}.rv-return-card{grid-template-columns:1fr;padding:19px 18px;gap:12px}.rv-return-mark{width:38px;height:38px}.rv-return-copy h3{font-size:21px}.rv-return-button{grid-column:auto;width:100%;min-width:0}.rv-return-panel{padding:24px 20px}.rv-return-actions{display:grid}.rv-return-action{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function installReturnUI() {
    const reviewComplete = document.querySelector('#finding .review-complete');
    if (!reviewComplete || document.getElementById('returnToSurveyButton')) return;

    installStyles();

    const area = document.createElement('div');
    area.className = 'rv-return-area';
    area.innerHTML = `
      <div class="rv-return-card">
        <div class="rv-return-mark" aria-hidden="true">✓</div>
        <div class="rv-return-copy">
          <div class="rv-return-kicker">Review complete</div>
          <h3>Continue your questionnaire</h3>
          <p>Your file review is complete. Return to the SurveyCake questionnaire to continue. <strong>Please use this button instead of the browser Back button.</strong></p>
        </div>
        <button class="rv-return-button" id="returnToSurveyButton" type="button"><span>Return to questionnaire</span><span class="rv-return-arrow" aria-hidden="true">→</span></button>
      </div>`;
    reviewComplete.insertAdjacentElement('afterend', area);

    returnBackdrop = document.createElement('div');
    returnBackdrop.className = 'rv-return-backdrop';
    returnBackdrop.id = 'returnSurveyBackdrop';
    returnBackdrop.setAttribute('role', 'dialog');
    returnBackdrop.setAttribute('aria-modal', 'true');
    returnBackdrop.setAttribute('aria-labelledby', 'returnSurveyTitle');
    returnBackdrop.innerHTML = `
      <section class="rv-return-panel">
        <div class="rv-return-modal-kicker">Questionnaire return</div>
        <h2 id="returnSurveyTitle">Return to the questionnaire</h2>
        <p id="returnSurveyMessage">Please return to the questionnaire you were using before this page.</p>
        <div class="rv-return-safety">To protect your questionnaire progress, this page will never open a new plain SurveyCake link automatically.</div>
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

    const backButton = document.getElementById('returnSurveyTryBack');
    const closeButton = document.getElementById('returnSurveyTryClose');
    if (isSafari && backButton) backButton.hidden = true;

    backButton.addEventListener('click', () => {
      if (isSafari) {
        safeFallback();
        return;
      }
      if (history.length > 1) attemptBack();
      else safeFallback();
    });
    closeButton.addEventListener('click', attemptClose);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installReturnUI);
  } else {
    installReturnUI();
  }
})();