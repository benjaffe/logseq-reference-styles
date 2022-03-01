import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import App, {BlockStyles} from './App';

const initialBlockStyles = {
  seedlings: {
    prefix: 'S: ',
    character: '🌱',
    color: '#4f9d03',
  },
} as BlockStyles;

export const handleClosePopup = () => {
  document.addEventListener(
    'keydown',
    function (e) {
      if (e.keyCode === 27) {
        logseq.hideMainUI({restoreEditingCursor: true});
      }
      e.stopPropagation();
    },
    false,
  );
};

const main = () => {
  console.log('logseq-quicktodo-plugin loaded');
  let blockStyles;
  try {
    blockStyles = JSON.parse(logseq.settings.blockStyles);
  } catch (err) {
    console.error(`Unable to read settings, resetting`);
  }
  if (!blockStyles) {
    logseq.updateSettings({
      blockStyles: JSON.stringify(initialBlockStyles),
    });
  }

  // register shortcut for quick todo
  logseq.App.registerCommandPalette(
    {
      key: 'logseq-reference-styles',
      label: 'Modify block reference styles',
    },
    () => logseq.showMainUI(),
  );

  handleClosePopup();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app'),
  );
};

logseq.ready(main).catch(console.error);
