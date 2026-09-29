import { useState } from "react";
import { DesignDecisions } from "./DesignDecisions";
import { Experiments } from "./Experiments";
import { ThemeCardSpecimen } from "./Homepage";
import { Newsfeed } from "./Newsfeed";
import { PageStyle } from "./PageStyle";
import { PrototypeNav, type LabPage } from "./PrototypeNav";
import { Rules } from "./Rules";

export default function App() {
  const [page, setPage] = useState<LabPage>("newsfeed");
  const [theme, setTheme] = useState<string | null>(null);

  const changePage = (next: LabPage) => {
    setTheme(null);
    setPage(next);
  };

  return (
    <>
      <PrototypeNav page={page} onPage={changePage} />
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
          <div hidden={theme !== null}>
            <Newsfeed onOpenTheme={setTheme} />
          </div>
          {theme ? <PageStyle key={theme} initialThemeId={theme} onBack={() => setTheme(null)} /> : null}
        </>
      )}
    </>
  );
}
