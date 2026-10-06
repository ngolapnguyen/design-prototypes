import { useEffect, useState } from "react";
import { DesignDecisions } from "./DesignDecisions";
import { Experiments } from "./Experiments";
import { ThemeCardSpecimen } from "./Homepage";
import { Newsfeed } from "./Newsfeed";
import { PrototypeNav, type LabPage, type StoryLayout } from "./PrototypeNav";
import { StoryChat } from "./StoryChat";
import { Rules } from "./Rules";

const NOTES_KEY = "homepage-annotations";
const STORY_LAYOUT_KEY = "homepage-story-layout";

function savedNoteCount() {
  try {
    const saved = localStorage.getItem(NOTES_KEY);
    if (!saved) return 0;
    const parsed = JSON.parse(saved) as { text?: string }[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.text?.trim()).length : 0;
  } catch {
    return 0;
  }
}

export default function App() {
  const [page, setPage] = useState<LabPage>("newsfeed");
  const [theme, setTheme] = useState<string | null>(null);
  const [commenting, setCommenting] = useState(false);
  const [noteCount, setNoteCount] = useState(savedNoteCount);
  const [storyLayout, setStoryLayout] = useState<StoryLayout>(() => {
    const saved = localStorage.getItem(STORY_LAYOUT_KEY);
    return saved === "bottom" || saved === "modal" ? saved : "side";
  });

  const changeStoryLayout = (next: StoryLayout) => {
    localStorage.setItem(STORY_LAYOUT_KEY, next);
    setStoryLayout(next);
  };

  const changePage = (next: LabPage) => {
    setTheme(null);
    setPage(next);
  };

  useEffect(() => {
    const sync = () => setNoteCount(savedNoteCount());
    window.addEventListener("storage", sync);
    window.addEventListener("homepage-annotations", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("homepage-annotations", sync);
    };
  }, []);

  return (
    <>
      <PrototypeNav
        page={page}
        onPage={changePage}
        storyLayout={theme ? storyLayout : undefined}
        onStoryLayout={changeStoryLayout}
        commenting={commenting}
        noteCount={noteCount}
        onCommenting={setCommenting}
      />
      {page === "decisions" ? (
        <>
          <ThemeCardSpecimen />
          <DesignDecisions />
        </>
      ) : page === "rules" ? (
        <Rules />
      ) : page === "experiments" ? (
        <Experiments />
      ) : (
        <>
          <div hidden={theme !== null && storyLayout !== "modal"}>
            <Newsfeed
              version={page === "newsfeed-v2" ? "v2" : "v1"}
              onOpenTheme={setTheme}
              commenting={commenting}
            />
          </div>
          {theme ? (
            <StoryChat
              key={`${theme}-${storyLayout}`}
              themeId={theme}
              layout={storyLayout}
              onBack={() => setTheme(null)}
            />
          ) : null}
        </>
      )}
    </>
  );
}
