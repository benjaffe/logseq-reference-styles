import "@logseq/libs";
export type ThemeMode = "light" | "dark" | undefined;

let Theme:ThemeMode = undefined
function setTheme(t) {
  Theme = t
}
export function getTheme() {
  return Theme
}

export default {
  async getTheme() {
    const config = await logseq.App.getUserConfigs()
    const theme = config.preferredThemeMode
    setTheme(theme)
    return theme
  },
  onThemeChange(cb: (ThemeMode: ThemeMode) => void) {
    logseq.App.onThemeModeChanged((ev) => {
      setTheme(ev.mode)
      cb(ev.mode);
    });
  },
};
