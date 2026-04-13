from flask import (
    Flask, render_template, request, redirect,
    url_for, send_file, flash, jsonify, abort
)
from werkzeug.utils import secure_filename
from pathlib import Path
from datetime import datetime
from io import BytesIO
import json
import platform
import subprocess
import unicodedata
import uuid

from gerar_contrato import gerar_docx, gerar_termo_quitacao, gerar_notificacao_avalista, gerar_notificacao_inadimplente, nome_arquivo_saida

app = Flask(__name__)
app.secret_key = "ativuz-secret-2026"

UPLOAD_FOLDER = Path("uploads")
CONTRATOS_FOLDER = Path("contratos")
HISTORICO_FILE = Path("historico.json")

UPLOAD_FOLDER.mkdir(exist_ok=True)
CONTRATOS_FOLDER.mkdir(exist_ok=True)
if not HISTORICO_FILE.exists():
    HISTORICO_FILE.write_text("[]", encoding="utf-8")


# ── helpers ───────────────────────────────────────────────

def _converter_pdf(caminho_docx: str, caminho_pdf: str):
    """Converte .docx para PDF: Word no Windows, LibreOffice no Linux."""
    if platform.system() == "Windows":
        import pythoncom
        from docx2pdf import convert
        pythoncom.CoInitialize()
        try:
            convert(caminho_docx, caminho_pdf)
        finally:
            pythoncom.CoUninitialize()
    else:
        output_dir = str(Path(caminho_pdf).parent)
        subprocess.run(
            ["libreoffice", "--headless", "--convert-to", "pdf",
             "--outdir", output_dir, caminho_docx],
            check=True, capture_output=True,
        )
        # LibreOffice nomeia o PDF pelo stem do docx
        gerado = Path(output_dir) / (Path(caminho_docx).stem + ".pdf")
        if gerado != Path(caminho_pdf):
            gerado.rename(caminho_pdf)


def _slugify(nome: str) -> str:
    """Minúsculas, sem acentos, espaços → underscore, sem caracteres especiais."""
    norm = unicodedata.normalize('NFD', nome)
    norm = ''.join(c for c in norm if unicodedata.category(c) != 'Mn')
    norm = norm.lower().strip()
    import re as _re
    norm = _re.sub(r'[^a-z0-9\s]', '', norm)
    norm = _re.sub(r'\s+', '_', norm)
    return norm or "sem_nome"


def detectar_tipo(filename: str):
    """Retorna 'locacao', 'quitacao', 'notificacao' ou None com base no nome do arquivo."""
    norm = unicodedata.normalize('NFD', filename.lower())
    norm = ''.join(c for c in norm if unicodedata.category(c) != 'Mn')
    if 'quitacao' in norm:
        return 'quitacao'
    if 'locacao' in norm:
        return 'locacao'
    if 'notificacao' in norm and 'inadimplente' in norm:
        return 'inadimplente'
    if 'notificacao' in norm:
        return 'notificacao'
    return None


def get_templates():
    result = []
    for f in sorted(UPLOAD_FOLDER.glob("*.docx")):
        meta_path = UPLOAD_FOLDER / f"{f.stem}.json"
        display_name = f.stem
        if meta_path.exists():
            display_name = json.loads(meta_path.read_text(encoding="utf-8")).get("nome", f.stem)
        result.append({
            "filename": f.name,
            "nome": display_name,
            "tamanho_kb": round(f.stat().st_size / 1024, 1),
            "data": datetime.fromtimestamp(f.stat().st_mtime).strftime("%d/%m/%Y %H:%M"),
        })
    return result


def get_historico():
    return json.loads(HISTORICO_FILE.read_text(encoding="utf-8"))


def save_historico(h):
    HISTORICO_FILE.write_text(json.dumps(h, ensure_ascii=False, indent=2), encoding="utf-8")


# ── página 1 — Templates ──────────────────────────────────

@app.route("/")
def pagina_templates():
    return render_template("templates.html", templates=get_templates(), active="templates")


@app.route("/upload", methods=["POST"])
def upload_template():
    nome = request.form.get("nome", "").strip()
    arquivo = request.files.get("arquivo")

    if not nome:
        flash("Informe um nome para o template.", "erro")
        return redirect(url_for("pagina_templates"))

    if not arquivo or arquivo.filename == "":
        flash("Selecione um arquivo .docx.", "erro")
        return redirect(url_for("pagina_templates"))

    if not arquivo.filename.lower().endswith(".docx"):
        flash("Apenas arquivos .docx são aceitos.", "erro")
        return redirect(url_for("pagina_templates"))

    uid = uuid.uuid4().hex[:8]
    safe_stem = secure_filename(f"{nome}_{uid}")
    dest = UPLOAD_FOLDER / f"{safe_stem}.docx"
    arquivo.save(str(dest))

    meta = UPLOAD_FOLDER / f"{safe_stem}.json"
    meta.write_text(json.dumps({"nome": nome}, ensure_ascii=False), encoding="utf-8")

    flash(f'Template "{nome}" enviado com sucesso!', "ok")
    return redirect(url_for("pagina_templates"))


@app.route("/templates/excluir/<filename>", methods=["POST"])
def excluir_template(filename):
    safe = secure_filename(filename)
    docx = UPLOAD_FOLDER / safe
    meta = UPLOAD_FOLDER / f"{Path(safe).stem}.json"
    if docx.exists():
        docx.unlink()
    if meta.exists():
        meta.unlink()
    flash("Template excluído.", "ok")
    return redirect(url_for("pagina_templates"))


# ── página 2 — Gerar Contrato ─────────────────────────────

@app.route("/gerar")
def pagina_gerar():
    return render_template("gerar.html", templates=get_templates(), active="gerar")


@app.route("/gerar-contrato", methods=["POST"])
def gerar_contrato_route():
    template_filename = request.form.get("template", "")
    if not template_filename:
        flash("Selecione um template.", "erro")
        return redirect(url_for("pagina_gerar"))

    template_path = UPLOAD_FOLDER / secure_filename(template_filename)
    if not template_path.exists():
        flash("Template não encontrado.", "erro")
        return redirect(url_for("pagina_gerar"))

    tipo = detectar_tipo(template_filename)
    if tipo is None:
        return jsonify({
            "error": "Template não reconhecido. Renomeie o arquivo com 'locacao', 'quitacao', 'notificacao' ou 'inadimplente' no nome."
        }), 400

    formato = request.form.get("formato", "docx")

    # ── Gerar documento ───────────────────────────────────
    try:
        if tipo == "locacao":
            campos = [
                "locatario_nome", "locatario_rg", "locatario_cpf",
                "locatario_endereco", "locatario_cep", "locatario_telefone",
                "avalista_nome", "avalista_cpf", "avalista_endereco", "avalista_telefone",
                "veiculo_descricao", "veiculo_marca", "veiculo_modelo", "veiculo_ano",
                "veiculo_motor", "veiculo_chassi", "veiculo_cor", "veiculo_placa",
                "contrato_inicio", "contrato_duracao", "valor_semanal",
                "data_dia", "data_mes", "data_ano",
                "testemunha1_nome", "testemunha1_rg", "testemunha1_cpf",
                "testemunha2_nome", "testemunha2_rg", "testemunha2_cpf",
            ]
            dados = {c: request.form.get(c, "") for c in campos}
            nome_pessoa   = dados["locatario_nome"]
            data_slug     = datetime.now().strftime("%d.%m.%Y")
            nome_saida    = f"contrato_locacao_{_slugify(nome_pessoa)}_{data_slug}.docx"
            caminho_saida = str(CONTRATOS_FOLDER / nome_saida)
            gerar_docx(dados, caminho_saida, template_path=str(template_path))

        elif tipo == "notificacao":
            avalista_nome  = request.form.get("avalista_nome_notif", "")
            nome_pessoa    = avalista_nome
            data_slug      = datetime.now().strftime("%d.%m.%Y")
            nome_saida     = f"notificacao_avalista_{_slugify(avalista_nome)}_{data_slug}.docx"
            caminho_saida  = str(CONTRATOS_FOLDER / nome_saida)

            gerar_notificacao_avalista(
                avalista_nome  = avalista_nome,
                data_contrato  = request.form.get("data_contrato", ""),
                locatario_nome = request.form.get("locatario_nome_notif", ""),
                valor_debito   = float(request.form.get("valor_debito") or 0),
                caminho_saida  = caminho_saida,
                template_path  = str(template_path),
            )

        elif tipo == "inadimplente":
            locatario_nome_inad = request.form.get("locatario_nome_inad", "")
            nome_pessoa         = locatario_nome_inad
            data_slug           = datetime.now().strftime("%d.%m.%Y")
            nome_saida          = f"notificacao_inadimplente_{_slugify(locatario_nome_inad)}_{data_slug}.docx"
            caminho_saida       = str(CONTRATOS_FOLDER / nome_saida)

            gerar_notificacao_inadimplente(
                locatario_nome = locatario_nome_inad,
                data_contrato  = request.form.get("data_contrato_inad", ""),
                valor_debito   = float(request.form.get("valor_debito_inad") or 0),
                caminho_saida  = caminho_saida,
                template_path  = str(template_path),
            )

        else:  # quitacao
            def _f(campo): return float(request.form.get(campo) or 0)
            def _i(campo): return int(float(request.form.get(campo) or 0))

            devedor_nome  = request.form.get("devedor_nome", "")
            nome_pessoa   = devedor_nome
            data_slug     = datetime.now().strftime("%d.%m.%Y")
            nome_saida    = f"quitacao_divida_{_slugify(devedor_nome)}_{data_slug}.docx"
            caminho_saida = str(CONTRATOS_FOLDER / nome_saida)

            gerar_termo_quitacao(
                devedor_nome          = devedor_nome,
                devedor_cpf           = request.form.get("devedor_cpf", ""),
                placa                 = request.form.get("placa", ""),
                mes_referencia_fipe   = request.form.get("mes_referencia_fipe", ""),
                valor_fipe            = _f("valor_fipe"),
                percentual_fipe       = _f("percentual_fipe"),
                meias_diarias         = _f("meias_diarias"),
                entrada               = _f("entrada"),
                num_parcelas_pagas    = _i("num_parcelas_pagas"),
                valor_parcela_paga    = _f("valor_parcela_paga"),
                num_parcelas_semanais = _i("num_parcelas_semanais"),
                valor_parcela_semanal = _f("valor_parcela_semanal"),
                data_primeira_parcela = request.form.get("data_primeira_parcela", ""),
                data_assinatura       = request.form.get("data_assinatura", ""),
                caminho_saida         = caminho_saida,
                template_path         = str(template_path),
            )

    except Exception as e:
        return jsonify({"error": f"Erro ao gerar contrato: {e}"}), 500

    # ── Histórico ─────────────────────────────────────────
    meta_path = UPLOAD_FOLDER / f"{template_path.stem}.json"
    nome_template = template_filename
    if meta_path.exists():
        nome_template = json.loads(meta_path.read_text(encoding="utf-8")).get("nome", template_filename)

    historico = get_historico()
    historico.append({
        "id": uuid.uuid4().hex,
        "locatario_nome": nome_pessoa,
        "data_hora": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "template": nome_template,
        "arquivo": nome_saida,
    })
    save_historico(historico)

    # ── PDF ──────────────────────────────────────────────
    if formato == "pdf":
        nome_pdf    = nome_saida.replace(".docx", ".pdf")
        caminho_pdf = str(CONTRATOS_FOLDER / nome_pdf)
        try:
            _converter_pdf(caminho_saida, caminho_pdf)
            pdf_bytes = BytesIO(Path(caminho_pdf).read_bytes())
            return send_file(
                pdf_bytes,
                as_attachment=True,
                download_name=nome_pdf,
                mimetype="application/pdf",
            )
        except Exception as e:
            docx_url = url_for("download_contrato", filename=nome_saida)
            return jsonify({
                "error": f"Erro ao gerar PDF: {e}",
                "docx_url": docx_url,
            }), 422

    # ── DOCX ─────────────────────────────────────────────
    return send_file(
        caminho_saida,
        as_attachment=True,
        download_name=nome_saida,
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )


# ── página 3 — Histórico ──────────────────────────────────

@app.route("/historico")
def pagina_historico():
    historico = list(reversed(get_historico()))
    return render_template("historico.html", historico=historico, active="historico")


@app.route("/historico/download/<path:filename>")
def download_contrato(filename):
    caminho = (CONTRATOS_FOLDER / filename).resolve()
    if not str(caminho).startswith(str(CONTRATOS_FOLDER.resolve())):
        abort(400)
    if not caminho.exists():
        flash("Arquivo não encontrado.", "erro")
        return redirect(url_for("pagina_historico"))
    return send_file(
        str(caminho),
        as_attachment=True,
        download_name=Path(filename).name,
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )


@app.route("/historico/download-pdf/<path:filename>")
def download_contrato_pdf(filename):
    caminho_docx = (CONTRATOS_FOLDER / filename).resolve()
    if not str(caminho_docx).startswith(str(CONTRATOS_FOLDER.resolve())):
        abort(400)
    if not caminho_docx.exists():
        return jsonify({"error": "Arquivo não encontrado."}), 404

    nome_pdf    = Path(filename).stem + ".pdf"
    caminho_pdf = CONTRATOS_FOLDER / nome_pdf
    try:
        _converter_pdf(str(caminho_docx), str(caminho_pdf))
        pdf_bytes = BytesIO(Path(caminho_pdf).read_bytes())
        return send_file(
            pdf_bytes,
            as_attachment=True,
            download_name=nome_pdf,
            mimetype="application/pdf",
        )
    except Exception as e:
        return jsonify({"error": f"Erro ao gerar PDF: {e}"}), 422


@app.route("/historico/excluir/<entry_id>", methods=["POST"])
def excluir_contrato(entry_id):
    historico = get_historico()
    entry = next((e for e in historico if e.get("id") == entry_id), None)
    if entry:
        arquivo = CONTRATOS_FOLDER / secure_filename(entry["arquivo"])
        if arquivo.exists():
            arquivo.unlink()
        historico = [e for e in historico if e.get("id") != entry_id]
        save_historico(historico)
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True)
