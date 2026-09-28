import { useState } from "react";
import { DesignDecisions } from "./DesignDecisions";
import { ThemeCardSpecimen } from "./Homepage";
import { Newsfeed } from "./Newsfeed";
import { PageStyle } from "./PageStyle";
import { PrototypeNav, type LabPage } from "./PrototypeNav";

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
      {page === "components" ? (
        <ThemeCardSpecimen />
      ) : page === "decisions" ? (
        <DesignDecisions />
      ) : page === "pagestyle" ? (
        <PageStyle onBack={() => changePage("newsfeed")} />
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
