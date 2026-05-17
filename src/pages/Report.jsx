import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { fetchNpmData } from "../lib/fetchNpmData";
import { fetchBundleSize } from "../lib/fetchBundleSize";
import { calculateScore } from "../lib/calculateScore";
import { saveAudit } from "../lib/storage";
import { decodeReport, encodeReport } from "../lib/encodeReport";
import SkeletonReport from "../components/SkeletonReport";
import OverviewCards from "../components/OverviewCards";
import HealthScore from "../components/HealthScore";
import VulnerabilityTable from "../components/VulnerabilityTable";
import OutdatedChart from "../components/OutdatedChart";
import BundleSizeChart from "../components/BundleSizeChart";
import Recommendations from "../components/Recommendations";
import { Button } from "../components/ui/button";
import { Download, Link as LinkIcon, Badge as BadgeIcon } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const container = useRef(null);

  useEffect(() => {
    async function processAudit() {
      if (location.hash) {
        const decoded = decodeReport(location.hash.substring(1));
        if (decoded) {
          setReport(decoded);
          setLoading(false);
          return;
        }
      }

      if (!location.state?.parsedData) {
        navigate("/");
        return;
      }

      const { name, dependencies } = location.state.parsedData;

      const enrichedDeps = await Promise.all(
        dependencies.map(async (dep) => {
          const npmData = await fetchNpmData(dep.name);
          
          const skipBundle = dep.isDev || 
                            dep.name.startsWith("@types/") || 
                            dep.name.startsWith("vite") || 
                            dep.name.startsWith("shadcn") || 
                            dep.name.startsWith("eslint");

          const bundleData = skipBundle ? null : await fetchBundleSize(dep.name, dep.cleanVersion);
          
          return {
            ...dep,
            latestVersion: npmData?.latestVersion,
            bundle: bundleData
          };
        })
      );

      const calculated = calculateScore(enrichedDeps);
      const fullReport = { name, ...calculated };
      
      setReport(fullReport);
      saveAudit(fullReport);
      setLoading(false);
    }

    processAudit();
  }, [location, navigate]);

  useGSAP(() => {
    if (!loading && report) {
      gsap.from(".report-header", { opacity: 0, y: -20, duration: 0.5 });
      gsap.from(".action-buttons", { opacity: 0, x: 20, duration: 0.5, delay: 0.2 });
    }
  }, { scope: container, dependencies: [loading, report] });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const hash = encodeReport(report);
    const url = `${window.location.origin}/report#${hash}`;
    navigator.clipboard.writeText(url);
    toast("Link copied!");
  };

  const handleCopyBadge = () => {
    const badge = `![StackAudit Score](https://img.shields.io/badge/StackAudit-${report.score}%2F100-00FF94?style=flat&logo=npm)`;
    navigator.clipboard.writeText(badge);
    toast("Badge copied! Paste in your README");
  };

  if (loading) {
    return <SkeletonReport />;
  }

  if (!report) return null;

  return (
    <div ref={container} className="w-full flex flex-col py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="report-header">
          <h1 className="text-3xl font-bold text-[#E8E8E8]">{report.name} Audit</h1>
          <p className="text-[#666666] text-sm mt-1">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="action-buttons flex gap-2 no-print">
          <button className="custom-share-btn flex items-center gap-2" onClick={handleCopyBadge}>
            <BadgeIcon className="w-4 h-4" /> Badge
          </button>
          <button className="custom-share-btn flex items-center gap-2" onClick={handleCopyLink}>
            <LinkIcon className="w-4 h-4" /> Share
          </button>
          <button className="custom-pdf-btn flex items-center gap-2" onClick={handlePrint}>
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <OverviewCards stats={report.stats} />
      
      <HealthScore score={report.score} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <OutdatedChart dependencies={report.analyzedDeps} />
        <BundleSizeChart dependencies={report.analyzedDeps} />
      </div>

      <Recommendations recommendations={report.recommendations} />
      
      <VulnerabilityTable dependencies={report.analyzedDeps} />
    </div>
  );
}