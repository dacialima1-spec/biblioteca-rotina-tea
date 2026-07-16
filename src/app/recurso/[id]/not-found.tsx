import Link from "next/link";

export default function NotFound() {
  return <div className="page-shell empty-page"><h1>Recurso não encontrado</h1><p>Este endereço não corresponde a um recurso aprovado.</p><Link className="primary-button" href="/biblioteca">Voltar para a biblioteca</Link></div>;
}
