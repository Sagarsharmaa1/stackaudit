import { useNavigate } from "react-router";
import DropZone from "../components/DropZone";
import RecentAudits from "../components/RecentAudits";
import BackgroundScene from "../components/BackgroundScene";
import { encodeReport } from "../lib/encodeReport";

export default function Home() {
  const navigate = useNavigate();

  const handleParsed = (parsedData) => {
    navigate("/report", { state: { parsedData } });
  };

  const handleSelectAudit = (reportData) => {
    const hash = encodeReport(reportData);
    navigate(`/report#${hash}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] py-12 overflow-hidden">
      <BackgroundScene />
      
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-[var(--text-primary)]">
          Audit your dependencies <span className="text-[var(--accent)] font-medium">in seconds.</span>
        </h1>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
          Drop your package.json to get an instant visual report of bundle sizes, outdated packages, and vulnerabilities without installing anything.
        </p>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <DropZone onParsed={handleParsed} />
        <RecentAudits onSelect={handleSelectAudit} />
      </div>
    </div>
  );
}