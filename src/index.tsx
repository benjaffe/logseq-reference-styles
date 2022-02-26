import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import App, {BlockStyles} from './App';

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
      blockStyles: JSON.stringify({
        seedlings: {
          prefix: 'S: ',
          character: '🌱',
          color: '#4f9d03',
        },
      }),
    });
  }
  // else {
  //   const setMe = {};
  //   Object.entries(blockStyles as BlockStyles).forEach(
  //     ([title, blockStyle]) => {
  //       if (blockStyle.character || blockStyle.color) {
  //         setMe[title] = blockStyle;
  //       }
  //     },
  //   );
  //   logseq.updateSettings({blockStyles: JSON.stringify(setMe)});
  // }

  // register shortcut for quick todo
  logseq.App.registerCommandPalette(
    {
      key: 'logseq-reference-styles',
      label: 'Modify block reference styles',
    },
    () => {
      logseq.showMainUI();
    },
  );

  logseq.provideModel({
    destroyThings: () => {
      console.log(`hi thereeee`, document.querySelectorAll('style'));
      Array.from(
        document.querySelectorAll('style[data-ref=_kf7vf288u]'),
      ).forEach((elem) => (elem.innerHTML = ''));
    },
  });

  logseq.on('ui:visible:changed', async () => {
    console.log(`hi thereeee`, document.querySelectorAll('style'));
    Array.from(document.querySelectorAll('style[data-ref=_kf7vf288u]')).forEach(
      (elem) => (elem.innerHTML = ''),
    );
  });

  handleClosePopup();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app'),
  );
};

logseq.ready(main).catch(console.error);
