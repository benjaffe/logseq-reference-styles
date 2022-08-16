import '@logseq/libs';
import React, {useState} from 'react';
import './App.css';
import {v4 as uuid} from 'uuid';
import {makePrefixCSS,makePrefixCSSDarkMode} from './makePrefixCSS';
import  ThemeConfig, {ThemeMode} from "./UserTheme"
import CustomInput from './customInput';
import DeleteButton from './cutomButton/deleteButton';
import AddButton from './cutomButton/AddButton'
export type BlockStyle = {
  prefix: string;
  character?: string;
  color?: string;
  colorDarkMode?: string;
};

export type BlockStyles = {[key: string]: BlockStyle};

const makeCSS = (customizations: BlockStyles,themeMode:ThemeMode) => {
  if(!themeMode || (themeMode === "light"))
    return Object.entries(customizations)
      .map((customization) => makePrefixCSS(...customization))
      .join('\n\n');
  else
    return Object.entries(customizations)
      .map((customization) => makePrefixCSSDarkMode(...customization))
      .join('\n\n');
};

const App = () => {
  const [blockStyles, setBlockStylesInStateOnly] = useState<BlockStyles>(
    JSON.parse(logseq.settings?.blockStyles) as BlockStyles,
  );
  const [userTheme,setUserTheme] = useState<ThemeMode>(undefined)

  React.useEffect(() => {
    ThemeConfig.getTheme()
    .then((theme) => {
      setUserTheme(theme)
    })
    ThemeConfig.onThemeChange(setUserTheme)
  },[])

  React.useEffect(() => {
    logseq.provideStyle({
      key: 'logseq-reference-styles-style',
      style: makeCSS(blockStyles,userTheme),
    });
  }, [blockStyles,userTheme]);

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

  function isDark() : "" | "dark"{
    return userTheme === "dark" ? "dark" : ""
  }

  return (
    <div
      tabIndex={-1}
      style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)'}}
      onClick={(e) => {
        logseq.hideMainUI({restoreEditingCursor: true});
      }}
    >
      <div
        className={`block-reference-container ${isDark()}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="closeButton" onClick={handleClose}>
          X
        </div>

        <div className={`block-ref-style-wrapper title ${isDark()}`}>
          <div className="block-ref-style title">
            {["Label","Emoji","Light","Dark"].map((title) => {
              return (<p className={isDark()} style={{textAlign:"center",fontFamily:"sans-serif"}}>{title}</p>)
            })}
          </div>
        </div>

        {Object.entries<BlockStyle>({
          ...blockStyles,
        }).map(([name, blockStyle]) => {
          const {prefix, character, color,colorDarkMode} = blockStyle;
          return (
            <div className="block-ref-style-wrapper">
              <div className="block-ref-style">
                <CustomInput
                  type="text"
                  value={prefix}
                  className={`${isDark()}`}
                  onChange={(e) =>
                    handleChange(name, {
                      ...blockStyle,
                      prefix: e.target.value,
                    })
                  }
                />
                <CustomInput
                  type="text"
                  className={`block-ref-input char ${isDark()}`}
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
                  className={`block-ref-input color ${isDark()}`}
                  value={color}
                  onChange={(e) =>
                    handleChange(name, {...blockStyle, color: e.target.value})
                  }
                />
                <input
                  type="color"
                  className={`block-ref-input color-dark ${isDark()}`}
                  value={colorDarkMode}
                  onChange={(e) =>
                    handleChange(name, {...blockStyle, colorDarkMode: e.target.value})
                  }
                />
              </div>
              <DeleteButton className="btn btn-block-remove" onClick={() => handleDelete(name)} />
            </div>
          );
        })}

        <AddButton
          className={`btn btn-add ${isDark()}`}
          type="button"
          value="Add"
          onClick={() => handleAdd()}
        />
      </div>
    </div>
  );
};

export default App;
