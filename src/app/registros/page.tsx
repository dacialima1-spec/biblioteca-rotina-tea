"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, FileDown, NotebookTabs, Trash2 } from "lucide-react";
import { deleteRecord, getRecords } from "@/lib/records-db";
import { generateProfessionalPdf } from "@/lib/professional-pdf";
import type { UsageRecord } from "@/types/resource";

const statusLabel = (status: UsageRecord["status"]) => status === "sozinho" ? "Concluiu sozinho" : status === "com-ajuda" ? "Concluiu com ajuda" : "Não concluiu";

export default function RecordsPage() {
  const [records, setRecords] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [identification, setIdentification] = useState("");
  const [generating, setGenerating] = useState(false);

  const refresh = async () => { setRecords(await getRecords()); setLoading(false); };
  useEffect(() => {
    getRecords().then((items) => { setRecords(items); setLoading(false); });
  }, []);

  const filtered = useMemo(() => records.filter((record) => (!start || record.data >= start) && (!end || record.data <= end)), [records, start, end]);
  const counts = {
    total: filtered.length,
    alone: filtered.filter((item) => item.status === "sozinho").length,
    helped: filtered.filter((item) => item.status === "com-ajuda").length,
    notCompleted: filtered.filter((item) => item.status === "nao-concluiu").length
  };
  const resourceCounts = Object.entries(filtered.reduce<Record<string, number>>((acc, item) => { acc[item.recursoTitulo] = (acc[item.recursoTitulo] ?? 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...resourceCounts.map(([, count]) => count));

  async function remove(id: string) {
    if (!window.confirm("Excluir este registro do dispositivo?")) return;
    await deleteRecord(id);
    await refresh();
  }

  async function exportPdf() {
    setGenerating(true);
    const period = start || end ? `${start || "início dos registros"} a ${end || "data atual"}` : "Todos os registros";
    await generateProfessionalPdf(filtered, identification, period);
    setGenerating(false);
  }

  return (
    <div className="page-shell records-page">
      <div className="page-title purple"><span><NotebookTabs /></span><div><p>Informações factuais salvas neste dispositivo</p><h1>Meus registros</h1></div></div>
      <section className="records-toolbar">
        <div><label>Data inicial<input type="date" value={start} onChange={(event) => setStart(event.target.value)} /></label><label>Data final<input type="date" value={end} onChange={(event) => setEnd(event.target.value)} /></label></div>
        <div className="pdf-controls"><label>Identificação para o PDF<input value={identification} onChange={(event) => setIdentification(event.target.value)} placeholder="Preenchida pela família" /></label><button className="primary-button" onClick={exportPdf} disabled={generating || !filtered.length}><FileDown size={18} /> {generating ? "Gerando…" : "Gerar resumo para profissional"}</button></div>
      </section>

      <div className="metric-grid">
        <article className="metric orange"><span>Registros</span><strong>{counts.total}</strong><small>No período selecionado</small></article>
        <article className="metric green"><span>Concluídas</span><strong>{counts.alone}</strong><small>Sem ajuda informada</small></article>
        <article className="metric blue"><span>Com ajuda</span><strong>{counts.helped}</strong><small>Registros informados</small></article>
        <article className="metric purple"><span>Sem conclusão</span><strong>{counts.notCompleted}</strong><small>Registros informados</small></article>
      </div>

      <section className="chart-panel">
        <div className="panel-heading"><BarChart3 /><div><span>Contagem descritiva</span><h2>Recursos mais utilizados</h2></div></div>
        {resourceCounts.length ? <div className="bar-chart">{resourceCounts.map(([name, count]) => <div className="bar-row" key={name}><span>{name}</span><div><i style={{ width: `${(count / maxCount) * 100}%` }} /></div><b>{count}</b></div>)}</div> : <p className="missing-information">Nenhum registro no período selecionado.</p>}
      </section>

      <section className="history-panel">
        <div className="panel-heading"><NotebookTabs /><div><span>Em ordem de data</span><h2>Histórico</h2></div></div>
        {loading ? <p>Carregando registros…</p> : !filtered.length ? <div className="empty-state"><span>☆</span><p>Nenhum registro salvo no período selecionado.</p></div> : (
          <div className="history-list">{filtered.map((record) => (
            <article className="history-card" key={record.id}>
              <div className="history-head"><div><span>{record.data} • {record.horario}</span><h3>{record.recursoTitulo}</h3><p>{record.local}</p></div><button aria-label="Excluir registro" onClick={() => remove(record.id)}><Trash2 /></button></div>
              <dl><div><dt>Atividade proposta</dt><dd>{record.atividadeProposta || "Não informado."}</dd></div><div><dt>Situação registrada</dt><dd>{statusLabel(record.status)}</dd></div><div><dt>Tipo de ajuda</dt><dd>{record.tipoAjuda || "Não informado."}</dd></div><div><dt>Observação dos responsáveis</dt><dd>{record.observacaoResponsaveis || "Não informado."}</dd></div></dl>
            </article>
          ))}</div>
        )}
      </section>

      <aside className="educational-notice"><span>!</span><div><strong>Informações objetivas</strong><p>O painel exibe apenas contagens e respostas registradas. Não realiza diagnóstico, avaliação, interpretação ou recomendação.</p></div></aside>
    </div>
  );
}
