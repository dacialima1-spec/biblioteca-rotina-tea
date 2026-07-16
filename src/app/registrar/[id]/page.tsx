"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { getResource } from "@/lib/resources";
import { saveRecord } from "@/lib/records-db";
import type { UsageRecord, UsageStatus } from "@/types/resource";

const today = () => new Date().toISOString().slice(0, 10);
const currentTime = () => new Date().toTimeString().slice(0, 5);

export default function RegisterPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const resource = useMemo(() => getResource(id), [id]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!resource) return <div className="page-shell empty-page"><h1>Recurso não encontrado</h1><Link href="/biblioteca">Voltar</Link></div>;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const data = new FormData(event.currentTarget);
    const record: UsageRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      data: String(data.get("data")),
      horario: String(data.get("horario")),
      local: String(data.get("local")),
      recursoId: resource!.id,
      recursoTitulo: resource!.titulo,
      atividadeProposta: String(data.get("atividadeProposta")),
      status: String(data.get("status")) as UsageStatus,
      tipoAjuda: String(data.get("tipoAjuda")),
      duracaoAproximada: String(data.get("duracaoAproximada")),
      mudancasRotina: String(data.get("mudancasRotina")),
      observacaoResponsaveis: String(data.get("observacaoResponsaveis")),
      emocaoInformada: String(data.get("emocaoInformada")),
      proximaTentativa: String(data.get("proximaTentativa")),
      duvidasProfissional: String(data.get("duvidasProfissional"))
    };
    await saveRecord(record);
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push("/registros"), 800);
  }

  return (
    <div className="page-shell form-page">
      <Link href={`/recurso/${resource.id}`} className="back-link"><ArrowLeft size={18} /> Voltar para o recurso</Link>
      <div className="page-title green"><span><Save /></span><div><p>Registro factual no seu dispositivo</p><h1>Registrar utilização</h1></div></div>
      <div className="form-intro"><strong>Recurso utilizado</strong><p>{resource.titulo}</p><small>As respostas serão apenas armazenadas. O aplicativo não analisa nem cria recomendações.</small></div>
      <form className="usage-form" onSubmit={submit}>
        <fieldset><legend>Quando e onde</legend><div className="form-grid three"><label>Data<input required type="date" name="data" defaultValue={today()} /></label><label>Horário<input required type="time" name="horario" defaultValue={currentTime()} /></label><label>Local<input required name="local" placeholder="Informe o local" /></label></div></fieldset>
        <fieldset><legend>Atividade e conclusão</legend><label>Atividade proposta<textarea required name="atividadeProposta" rows={3} placeholder="Escreva o que foi proposto" /></label><div className="radio-cards"><label><input required type="radio" name="status" value="sozinho" /> Concluiu sozinho</label><label><input type="radio" name="status" value="com-ajuda" /> Concluiu com ajuda</label><label><input type="radio" name="status" value="nao-concluiu" /> Não concluiu</label></div><div className="form-grid"><label>Tipo de ajuda utilizada<input name="tipoAjuda" placeholder="Preenchido pelo responsável" /></label><label>Duração aproximada<input name="duracaoAproximada" placeholder="Ex.: 10 minutos" /></label></div></fieldset>
        <fieldset><legend>Informações registradas pelo responsável</legend><label>Mudanças na rotina<textarea name="mudancasRotina" rows={3} /></label><label>Observação escrita pelos responsáveis<textarea name="observacaoResponsaveis" rows={4} /></label><label>Emoção informada pela criança, quando aplicável<input name="emocaoInformada" /></label><div className="form-grid"><label>Próxima tentativa<textarea name="proximaTentativa" rows={3} /></label><label>Dúvidas para o profissional<textarea name="duvidasProfissional" rows={3} /></label></div></fieldset>
        <div className="form-actions"><Link href={`/recurso/${resource.id}`} className="secondary-button">Cancelar</Link><button disabled={saving || saved} className="primary-button" type="submit">{saved ? <><CheckCircle2 size={18} /> Salvo</> : <><Save size={18} /> {saving ? "Salvando…" : "Salvar registro"}</>}</button></div>
      </form>
    </div>
  );
}
