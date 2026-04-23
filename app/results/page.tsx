import { parseWhoisData } from '@/lib/whois-parser';

export default async function ResultsPage({
  searchParams,
}: {
  searchParams?: { domain?: string }
}) {
  const domain = searchParams?.domain;
  if (!domain) {
    return <div className="text-center py-10">è¯·è¾å¥åå</div>;
  }

  // æ³¨æï¼å¦éå¼å®¹ SSRï¼è¯·ç¡®ä¿ fetch å¯ä»¥å¨æå¡ç«¯ç¨ï¼å¦ http://127.0.0.1:3000/api/whoisï¼
  const response = await fetch(`/api/whois?domain=${domain}`, { cache: "no-store" });
  const whoisRaw = await response.text();
  const whois = parseWhoisData(whoisRaw);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">WHOISæ¥è¯¢ç»æ</h1>
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">æ³¨ååä¿¡æ¯</h2>
        <ul>
          <li>åç§°ï¼{whois.registrar.name || 'æªç¥'}</li>
          <li>ç½åï¼{whois.registrar.website || 'æªç¥'}</li>
          <li>é®ç®±ï¼{whois.registrar.email || 'æªç¥'}</li>
          <li>çµè¯ï¼{whois.registrar.phone || 'æªç¥'}</li>
        </ul>
      </section>
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">æ³¨åäººä¿¡æ¯</h2>
        <ul>
          <li>åç§°ï¼{whois.registrant.name || 'æªç¥'}</li>
          <li>é®ç®±ï¼{whois.registrant.email || 'æªç¥'}</li>
          <li>çµè¯ï¼{whois.registrant.phone || 'æªç¥'}</li>
        </ul>
      </section>
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">ååç¶æ</h2>
        <ul>
          {whois.domainStatus?.length
            ? whois.domainStatus.map((s, i) => <li key={i}>{s}</li>)
            : <li>æªç¥</li>}
        </ul>
      </section>
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Name Servers</h2>
        <ul>
          {whois.nameServers?.length
            ? whois.nameServers.map((ns, i) => <li key={i}>{ns}</li>)
            : <li>æªç¥</li>}
        </ul>
      </section>
    </div>
  );
}
