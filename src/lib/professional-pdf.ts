"use client";

import type { UsageRecord } from "@/types/resource";

const notice = "Este documento organiza informações registradas pela família. Ele não realiza diagnóstico, avaliação clínica ou interpretação profissional.";

export async function generateProfessionalPdf(records: UsageRecord[], identification: string, period: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = 24;

  function header() {
    doc.setFillColor(255, 90, 31);
    doc.roundedRect(margin, 12, width - margin * 2, 19, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Resumo de Rotina e Observações", width / 2, 24, { align: "center" });
    doc.setTextColor(45, 37, 32);
    y = 40;
  }

  function footer() {
    doc.setDrawColor(255, 174, 0);
    doc.line(margin, height - 24, width - margin, height - 24);
    doc.setTextColor(85, 71, 65);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const lines = doc.splitTextToSize(notice, width - margin * 2);
    doc.text(lines, margin, height - 18);
  }

  function newPageIfNeeded(space = 20) {
    if (y + space > height - 30) {
      footer();
      doc.addPage();
      header();
    }
  }

  function label(text: string, value: string) {
    newPageIfNeeded(13);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(54, 87, 132);
    doc.text(text, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(45, 37, 32);
    const lines = doc.splitTextToSize(value || "Não informado.", width - margin * 2);
    doc.text(lines, margin, y + 5);
    y += 8 + lines.length * 4;
  }

  header();
  label("Identificação", identification);
  label("Período selecionado", period);
  label("Quantidade de registros", String(records.length));

  const byResource = Object.entries(records.reduce<Record<string, number>>((acc, item) => {
    acc[item.recursoTitulo] = (acc[item.recursoTitulo] ?? 0) + 1;
    return acc;
  }, {}));
  label("Recursos utilizados e frequência", byResource.length ? byResource.map(([name, count]) => `${name}: ${count}`).join("\n") : "Nenhum registro no período.");

  records.forEach((record, index) => {
    newPageIfNeeded(55);
    doc.setFillColor(245, 250, 255);
    doc.roundedRect(margin, y, width - margin * 2, 9, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(45, 37, 32);
    doc.text(`${index + 1}. ${record.recursoTitulo} — ${record.data} às ${record.horario}`, margin + 3, y + 6);
    y += 14;
    label("Local", record.local);
    label("Atividade proposta", record.atividadeProposta);
    label("Situação registrada", record.status === "sozinho" ? "Concluiu sozinho" : record.status === "com-ajuda" ? "Concluiu com ajuda" : "Não concluiu");
    label("Nível/tipo de ajuda informado", record.tipoAjuda);
    label("Duração aproximada", record.duracaoAproximada);
    label("Mudanças na rotina", record.mudancasRotina);
    label("Observações dos responsáveis", record.observacaoResponsaveis);
    label("Emoção informada pela criança", record.emocaoInformada);
    label("Próxima tentativa", record.proximaTentativa);
    label("Dúvidas cadastradas", record.duvidasProfissional);
  });

  footer();
  doc.save("Resumo-de-Rotina-e-Observacoes.pdf");
}
