"use client";

import useTheme from "@/stores/ThemeStore";

export default function Theme() {
  const theme = useTheme((state) => state.theme);
  const toggleTheme = useTheme((state) => state.toggleTheme);

  return (
    <div className="mx-4">
      <label className="swap swap-flip text-2xl">
        {/* this hidden checkbox controls the state */}
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />

        <div className="swap-off">🌙</div>
        <div className="swap-on">🔆</div>
      </label>
    </div>
  );
}
