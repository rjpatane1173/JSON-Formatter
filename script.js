/* JSON Formatter Tool - Vanilla JS
   Modular structure for future extension (subscription, server validation, etc.)
*/
(function(){
  const MAX_FREE_SIZE = 102400; // 100KB in bytes
  const DEFAULT_AD_SECONDS = 5;
  let isPro = false; // future: toggle to bypass ad

  // DOM refs
  const fileInput = document.getElementById('fileInput');
  const inputText = document.getElementById('inputText');
  const formatBtn = document.getElementById('formatBtn');
  const outputPre = document.getElementById('output');
  const messageEl = document.getElementById('message');
  const adOverlay = document.getElementById('adOverlay');
  const countdownEl = document.getElementById('countdown');
  const cancelAdBtn = document.getElementById('cancelAd');

  let adTimer = null;
  let adRemaining = DEFAULT_AD_SECONDS;
  let lastLoadedFileSize = null;

  // Helpers
  function showMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.style.color = isError ? 'var(--danger)' : '';
  }

  function clearMessage(){ showMessage(''); }

  function formatAndShow(text){
    try{
      const obj = JSON.parse(text);
      const pretty = JSON.stringify(obj, null, 4);
      outputPre.textContent = pretty;
      clearMessage();
    }catch(err){
      outputPre.textContent = '';
      showMessage('Invalid JSON: ' + err.message, true);
    }
  }

  function bytesOfString(str){
    return new Blob([str]).size;
  }

  function exceedsLimit(size){
    return size > MAX_FREE_SIZE;
  }

  // Ad gate
  // startAdGate: show overlay for `seconds` (defaults to DEFAULT_AD_SECONDS)
  // onFinished called when countdown reaches zero. Canceling will stop and hide overlay.
  function startAdGate(onFinished, seconds){
    if(isPro){ onFinished(); return; }
    const secs = typeof seconds === 'number' ? Math.max(1, Math.floor(seconds)) : DEFAULT_AD_SECONDS;
    adRemaining = secs;
    countdownEl.textContent = adRemaining;
    adOverlay.classList.remove('hidden');

    adTimer = setInterval(()=>{
      adRemaining -= 1;
      countdownEl.textContent = adRemaining;
      if(adRemaining <= 0){
        clearInterval(adTimer);
        adTimer = null;
        adOverlay.classList.add('hidden');
        onFinished();
      }
    }, 1000);
  }

  function cancelAdGate(){
    if(adTimer){
      clearInterval(adTimer);
      adTimer = null;
    }
    adOverlay.classList.add('hidden');
    // reset countdown display for next attempt
    countdownEl.textContent = DEFAULT_AD_SECONDS;
    adRemaining = DEFAULT_AD_SECONDS;
  }

  // Events
  fileInput.addEventListener('change', (e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    lastLoadedFileSize = file.size;
    if(exceedsLimit(file.size)){
      inputText.value = '';
      showMessage('Files larger than 100KB require Pro subscription (coming soon).', true);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(){
      inputText.value = reader.result || '';
      clearMessage();
    };
    reader.onerror = function(){
      showMessage('Failed to read file', true);
    };
    reader.readAsText(file);
  });

  // If user edits the textarea after loading a file, clear the last loaded file size
  inputText.addEventListener('input', ()=>{ lastLoadedFileSize = null; });

  formatBtn.addEventListener('click', ()=>{
    const text = inputText.value || '';
    let size = lastLoadedFileSize;
    if(size == null){
      size = bytesOfString(text);
    }

    if(exceedsLimit(size)){
      showMessage('Files larger than 100KB require Pro subscription (coming soon).', true);
      return;
    }

    clearMessage();
    startAdGate(()=>{
      formatAndShow(text);
    }, DEFAULT_AD_SECONDS);
  });

  cancelAdBtn.addEventListener('click', ()=>{
    cancelAdGate();
    showMessage('Ad canceled. Please try the action again.', true);
  });

  // Copy button
  const copyBtn = document.getElementById('copyBtn');
  if(copyBtn){
    copyBtn.addEventListener('click', async ()=>{
      const text = outputPre.textContent || '';
      if(!text){ showMessage('Nothing to copy.', true); return; }
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){
          await navigator.clipboard.writeText(text);
        }else{
          const ta = document.createElement('textarea');
          ta.value = text; document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta);
        }
        showMessage('Copied to clipboard.', false);
        setTimeout(clearMessage, 2500);
      }catch(err){
        showMessage('Copy failed: ' + err.message, true);
      }
    });
  }

  // Download button with 10s ad
  const downloadBtn = document.getElementById('downloadBtn');
  if(downloadBtn){
    downloadBtn.addEventListener('click', ()=>{
      const text = outputPre.textContent || '';
      if(!text){ showMessage('Nothing to download.', true); return; }

      const size = bytesOfString(text);
      if(exceedsLimit(size)){
        showMessage('Files larger than 100KB require Pro subscription (coming soon).', true);
        return;
      }

      // Start 10s ad then download
      startAdGate(()=>{
        try{
          const blob = new Blob([text], {type:'application/json'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'formatted.json'; document.body.appendChild(a);
          a.click(); document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showMessage('Download started.', false);
          setTimeout(clearMessage, 2500);
        }catch(err){
          showMessage('Download failed: ' + err.message, true);
        }
      }, 10);
    });
  }

  // Expose small API for future use (subscription toggle, limit change)
  window.JSONFormatterTool = {
    setPro(value){ isPro = !!value; },
    setMaxFreeSize(bytes){ /* future: change limit at runtime */ },
  };

})();
