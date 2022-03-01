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

  React.useEffect(() => {
    logseq.provideStyle({
      key: 'logseq-reference-styles-style',
      style: makeCSS(blockStyles),
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

  const handleClose = async (e: any) => {
    logseq.hideMainUI({restoreEditingCursor: true});
  };

  const handleChange = (name: string, blockStyle: BlockStyle) => {
    setBlockStyles({...blockStyles, [name]: blockStyle});
  };

  const handleDelete = (name) => {
    const newStyles = {
      ...blockStyles,
    };
    delete newStyles[name];
    setBlockStyles(newStyles);
  };

  return (
    <div
      tabIndex={-1}
      style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)'}}
      onClick={(e) => {
        logseq.hideMainUI({restoreEditingCursor: true});
      }}
    >
      <div
        className="block-reference-container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="closeButton" onClick={handleClose}>
          X
        </div>

        {Object.entries<BlockStyle>({
          ...blockStyles,
        }).map(([name, blockStyle]) => {
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
                onClick={() => handleDelete(name)}
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
      </div>
    </div>
  );
};

export default App;
