"use client";

export function OpenPaletteButton() {
  return <button className="button" type="button" onClick={() => window.dispatchEvent(new Event("open-command-palette"))}>Open Command Palette</button>;
}
