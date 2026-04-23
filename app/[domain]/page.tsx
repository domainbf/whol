import { getWhoisData } from "@/lib/whois";
import { parseWhoisData } from "@/lib/whois-parser";
import { 
  Calendar, 
  ShieldCheck, 
  Globe, 
  Server, 
  Clock, 
  Building2,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ domain: string }>;
}

export default async function DomainPage({ params }: PageProps) {
  const { domain } = await params;
  const rawData = await getWhoisData(domain);
  const info = parseWhoisData(rawData);

  const isAvailable = rawData.toLowerCase().includes("not found") || rawData.toLowerCase().includes("no match");

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 pb-12">
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-10 w-full border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} />
            返回搜索
          </Link>
          <div className="flex items-center gap-3">
             <span className="text-lg font-bold tracking-tight">{domain}</span>
             <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
               isAvailable ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
             }`}>
               {isAvailable ? "可注册" : "已注册"}
             </span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 左侧主要信息卡片 */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="text-blue-500" size={20} />
                  注册信息
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem icon={<Building2 size={18}/>} label="注册商" value={info.registrar} />
                <InfoItem icon={<Globe size={18}/>} label="WHOIS 服务器" value={info.whoisServer} />
                <InfoItem icon={<Calendar size={18}/>} label="注册日期" value={info.creationDate} />
                <InfoItem icon={<Clock size={18}/>} label="过期日期" value={info.expiryDate} highlight />
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                     <Server size={18} /> 域名服务器 (DNS)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {info.nameServer.split(' ').map((ns, i) => (
                      ns && <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded-md text-sm font-mono">{ns}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <h2 className="text-lg font-semibold">原始 WHOIS 数据</h2>
              </div>
              <div className="p-6">
                <pre className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400 font-mono bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl overflow-x-auto max-h-[500px]">
                  {rawData}
                </pre>
              </div>
            </section>
          </div>

          {/* 右侧边栏 - 状态摘要 */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
              <h3 className="text-white/80 text-sm font-medium mb-1">域名状态</h3>
              <div className="space-y-3 mt-4">
                {info.status.split(' ').filter(Boolean).map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-xs font-mono break-all border border-white/10">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-400">最后更新</h4>
              <p className="text-slate-600 dark:text-zinc-300 font-medium">
                {info.updatedDate || "未提供"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon, label, value, highlight = false }: { 
  icon: React.ReactNode, 
  label: string, 
  value?: string,
  highlight?: boolean 
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm text-slate-500 flex items-center gap-2">
        {icon}
        {label}
      </div>
      <div className={`text-base font-semibold ${highlight ? "text-orange-500" : "text-slate-900 dark:text-zinc-100"}`}>
        {value || "N/A"}
      </div>
    </div>
  );
}