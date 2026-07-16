"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Binoculars, CalendarCheck, Download, Eye, FileText, Info, ListChecks, MessageSquareText, Printer } from "lucide-react";
import { ApprovedList, InfoSection } from "@/components/info-section";
import { FavoriteButton } from "@/components/favorite-button";
import { usePreferences } from "@/hooks/use-preferences";
import { fallbackText, getResource } from "@/lib/resources";

export default function ResourcePage() {
  const { id } = useParams<{ id: string }>();
  const resource = getResource(id);
  const { addRecent } = usePreferences();

  useEffect(() => { if (resource) addRecent(resource.id); }, [resource, addRecent]);
  if (!resource) notFound();

  const openPrint = () => window.open(resource.arquivoImpressao, "_blank", "noopener,noreferrer");

  return (
    <div className="page-shell resource-page">
      <Link href="/biblioteca" className="back-link"><ArrowLeft size={18} /> Voltar para a biblioteca</Link>
      <div className="resource-detail-header">
        <div className="resource-large-preview"><Image src={resource.arquivoVisual} alt={`Prévia completa do recurso ${resource.titulo}`} fill priority sizes="(max-width: 800px) 92vw, 540px" /></div>
        <div className="resource-summary">
          <div className="chip-row">{resource.categoria.map((category) => <span className="chip" key={category}>{category}</span>)}</div>
          <h1>{resource.titulo}</h1>
          {resource.subtitulo && <p className="resource-subtitle">{resource.subtitulo}</p>}
          <div className="origin-box"><span>Produto de origem</span><strong>{resource.produtoOrigem}</strong></div>
          <p className="approved-description">{resource.descricaoAprovada ?? fallbackText}</p>
          <div className="resource-actions">
            <a className="primary-button" href={resource.arquivoVisual} target="_blank" rel="noreferrer"><Eye size={18} /> Visualizar</a>
            <a className="secondary-button" href={resource.arquivoImpressao} download><Download size={18} /> Baixar PDF</a>
            <button className="secondary-button" onClick={openPrint}><Printer size={18} /> Imprimir</button>
          </div>
          <div className="resource-actions secondary-row"><FavoriteButton id={resource.id} /><Link className="register-button" href={`/registrar/${resource.id}`}><CalendarCheck size={18} /> Registrar utilização</Link></div>
        </div>
      </div>

      <div className="info-grid">
        <InfoSection title="Para que serve" icon={<Info />} tone="orange"><p>{resource.descricaoAprovada ?? fallbackText}</p></InfoSection>
        <InfoSection title="Em que situação utilizar" icon={<MessageSquareText />} tone="blue"><ApprovedList items={resource.situacoesDeUso} fallback={fallbackText} /></InfoSection>
        <InfoSection title="Como utilizar" icon={<ListChecks />} tone="green"><ApprovedList items={resource.instrucoesDeUso} fallback={fallbackText} /></InfoSection>
        <InfoSection title="O que observar depois" icon={<Binoculars />} tone="purple"><ApprovedList items={resource.camposParaObservar} fallback={fallbackText} /></InfoSection>
        <InfoSection title="Informações que podem ser registradas para compartilhar com um profissional" icon={<FileText />} tone="pink"><ApprovedList items={resource.informacoesParaCompartilhar} fallback={fallbackText} /></InfoSection>
      </div>

      <aside className="educational-notice">
        <span>!</span><div><strong>Aviso de finalidade educativa</strong><p>{resource.aviso ?? fallbackText}</p><small>Este aplicativo não substitui acompanhamento profissional.</small></div>
      </aside>
    </div>
  );
}
