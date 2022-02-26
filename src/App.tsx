import '@logseq/libs';
import React, {useState} from 'react';
import './App.css';
import {v4 as uuid} from 'uuid';
import {makePrefixCSS} from './makePrefixCSS';

export type BlockStyle = {
  prefix: string;
  character?: string;
  color?: string;
};

export type BlockStyles = {[key: string]: BlockStyle};

const makeCSS = (customizations: BlockStyles) => {
  return Object.entries(customizations)
    .map((customization) => makePrefixCSS(...customization))
    .join('\n\n');
};

const App = () => {
  const [blockStyles, setBlockStylesInStateOnly] = useState<BlockStyles>(
    JSON.parse(logseq.settings.blockStyles) as BlockStyles,
  );
  console.log(`rendering`, blockStyles);

  React.useEffect(() => {
    console.log(logseq.provideStyle(makeCSS(blockStyles)));

    logseq.provideModel({
      refreshReferenceStyles: () => {
        console.log(
          'hi',
          Array.from(document.querySelectorAll('style[data-ref=_kf7vf288u]')),
        );

        Array.from(
          document.querySelectorAll('style[data-ref=_kf7vf288u]'),
        ).forEach((elem) => (elem.innerHTML = ''));
        logseq.provideStyle(makeCSS(blockStyles));
      },
    });
  }, [blockStyles]);

  const setBlockStyles = (blockStyles: BlockStyles) => {
    setBlockStylesInStateOnly(blockStyles);
    logseq.updateSettings({blockStyles: JSON.stringify(blockStyles)});
  };

  const handleAdd = () => {
    const id = uuid();
    setBlockStyles({
      ...blockStyles,
      [id]: {prefix: 'Party: ', character: '🎉'},
    });
  };
  const handleSubmit = async (e: any) => {
    setBlockStyles(blockStyles);
    logseq.App.relaunch();
  };

  const handleChange = (name: string, blockStyle: BlockStyle) => {
    console.log(`hi!`, name, blockStyle);
    setBlockStyles({...blockStyles, [name]: blockStyle});
  };
  const handleDelete = (name) => {
    setBlockStyles({
      ...blockStyles,
      [name]: {prefix: blockStyles[name].prefix},
    });
  };

  return (
    <div
      tabIndex={-1}
      style={{width: '100%', height: '100vh', background: 'rgba(0,0,0,0.3)'}}
      onClick={(e) => {
        logseq.hideMainUI({restoreEditingCursor: true});
      }}
    >
      <div
        className="block-reference-container"
        style={{minWidth: '33%'}}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {Object.entries<BlockStyle>({
          ...blockStyles,
        })
          .filter(
            ([name, blockStyle]) => blockStyle.character || blockStyle.color,
          )
          .map(([name, blockStyle]) => {
            const {prefix, character, color} = blockStyle;
            return (
              <div className="block-ref-style-wrapper">
                <div className="block-ref-style">
                  <input
                    type="text"
                    className="block-ref-input fix"
                    value={prefix}
                    onChange={(e) =>
                      handleChange(name, {
                        ...blockStyle,
                        prefix: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="block-ref-input char"
                    value={character}
                    onChange={(e) =>
                      handleChange(name, {
                        ...blockStyle,
                        character: e.target.value,
                      })
                    }
                  />
                  <input
                    type="color"
                    className="block-ref-input color"
                    value={color}
                    onChange={(e) =>
                      handleChange(name, {...blockStyle, color: e.target.value})
                    }
                  />
                </div>
                <input
                  className="btn btn-block-remove"
                  type="button"
                  value="X"
                  onClick={(e) => handleDelete(name)}
                />
              </div>
            );
          })}

        <input
          className="btn btn-add"
          type="button"
          value="Add"
          onClick={() => handleAdd()}
        />
        <input
          className="btn btn-save"
          type="button"
          value="Save"
          onClick={(e) => handleSubmit(e)}
        />
        <input
          className="btn btn-save"
          type="button"
          value="Refresh"
          data-on-click="refreshReferenceStyles"
        />
      </div>
    </div>
  );
};

export default App;
