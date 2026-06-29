import nodemailer from "nodemailer";

type ReservaEmail = {
  nome: string;
  telefone: string;
  email: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  crm?: string | null;
  especialidade?: string | null;
  observacao?: string | null;
};

function valor(v?: string | null) {
  return v && String(v).trim() ? v : "-";
}

function montarHtmlMedico(reserva: ReservaEmail) {
  const dataBR = reserva.data.split("-").reverse().join("/");
  const horario = `${reserva.horaInicio} às ${reserva.horaFim}`;

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <body style="margin:0;padding:0;background:#f7f2ee;font-family:Arial,Helvetica,sans-serif;color:#2b211c;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f2ee;padding:36px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(43,33,28,0.12);">
                <tr>
                  <td style="background:linear-gradient(135deg,#2b211c,#5a4032);padding:42px 36px;text-align:center;">
                    <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
                      Dra. Tauana Leão
                    </div>
                    <div style="margin-top:10px;font-size:14px;color:#e8d8cc;letter-spacing:2.5px;text-transform:uppercase;">
                      Agenda do consultório
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 36px 36px;">
                    <div style="width:76px;height:76px;border-radius:999px;background:#ecfdf5;color:#059669;margin:-38px auto 28px;line-height:76px;text-align:center;font-size:34px;font-weight:700;border:6px solid #ffffff;">
                      ✓
                    </div>

                    <h1 style="margin:0;text-align:center;font-size:30px;line-height:38px;color:#2b211c;">
                      Reserva confirmada
                    </h1>

                    <p style="margin:18px auto 0;max-width:520px;text-align:center;font-size:15px;line-height:26px;color:#7b6a5f;">
                      Olá, <strong style="color:#2b211c;">${reserva.nome}</strong>.
                      Sua reserva para utilização do consultório foi confirmada com sucesso.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:34px;background:#fbfaf8;border:1px solid #eadfd7;border-radius:22px;padding:8px 24px;">
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">Data</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${dataBR}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">Horário</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${horario}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">CRM</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${valor(reserva.crm)}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">Especialidade</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${valor(reserva.especialidade)}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">Telefone</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${reserva.telefone}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;color:#7b6a5f;font-size:14px;">Observação</td>
                        <td align="right" style="padding:16px 0;color:#2b211c;font-size:15px;font-weight:700;">${valor(reserva.observacao)}</td>
                      </tr>
                    </table>

                    <div style="margin-top:30px;padding:22px;border-radius:20px;background:#f7f2ee;color:#6f5d52;font-size:14px;line-height:24px;">
                      <strong style="color:#2b211c;">Orientação:</strong><br/>
                      Chegue com antecedência e mantenha a sala organizada após o uso.
                      Em caso de dúvidas ou necessidade de alteração, entre em contato com a equipe da Dra. Tauana Leão.
                    </div>

                    <div style="margin-top:32px;text-align:center;">
                      <span style="display:inline-block;background:#2b211c;color:#ffffff;padding:15px 26px;border-radius:999px;font-weight:700;font-size:14px;">
                        Reserva registrada com sucesso
                      </span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="background:#fbfaf8;padding:26px;text-align:center;color:#9b8c83;font-size:12px;line-height:20px;">
                    Este é um e-mail automático da agenda do consultório da Dra. Tauana Leão.<br/>
                    Por favor, não responda este e-mail.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function montarHtmlTauana(reserva: ReservaEmail) {
  const dataBR = reserva.data.split("-").reverse().join("/");
  const horario = `${reserva.horaInicio} às ${reserva.horaFim}`;

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <body style="margin:0;padding:0;background:#f7f2ee;font-family:Arial,Helvetica,sans-serif;color:#2b211c;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f2ee;padding:36px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(43,33,28,0.12);">
                <tr>
                  <td style="background:linear-gradient(135deg,#2b211c,#5a4032);padding:38px 36px;">
                    <div style="font-size:13px;color:#e8d8cc;letter-spacing:2.5px;text-transform:uppercase;">
                      Nova reserva recebida
                    </div>
                    <div style="margin-top:12px;font-size:30px;line-height:38px;font-weight:700;color:#ffffff;">
                      Consultório reservado
                    </div>
                    <div style="margin-top:10px;font-size:15px;color:#e8d8cc;">
                      ${dataBR} • ${horario}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:36px;">
                    <p style="margin:0 0 26px;font-size:15px;line-height:26px;color:#7b6a5f;">
                      Uma nova reserva foi realizada na agenda da sala. Confira os dados abaixo:
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fbfaf8;border:1px solid #eadfd7;border-radius:22px;padding:8px 24px;">
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">Nome</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${reserva.nome}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">Data</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${dataBR}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">Horário</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${horario}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">CRM</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${valor(reserva.crm)}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">Especialidade</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${valor(reserva.especialidade)}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">Telefone</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${reserva.telefone}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;border-bottom:1px solid #eee5df;color:#7b6a5f;font-size:14px;">E-mail</td>
                        <td align="right" style="padding:16px 0;border-bottom:1px solid #eee5df;color:#2b211c;font-size:15px;font-weight:700;">${reserva.email}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0;color:#7b6a5f;font-size:14px;">Observação</td>
                        <td align="right" style="padding:16px 0;color:#2b211c;font-size:15px;font-weight:700;">${valor(reserva.observacao)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="background:#fbfaf8;padding:26px;text-align:center;color:#9b8c83;font-size:12px;line-height:20px;">
                    Agenda do consultório • Dra. Tauana Leão
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function enviarEmailReserva(reserva: ReservaEmail) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Agenda Sala | Dra. Tauana Leão" <${process.env.EMAIL_USER}>`,
    to: reserva.email,
    subject: "Reserva confirmada • Consultório Dra. Tauana Leão",
    html: montarHtmlMedico(reserva),
  });

  await transporter.sendMail({
    from: `"Agenda Sala | Dra. Tauana Leão" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TAUANA,
    subject: "Nova reserva do consultório",
    html: montarHtmlTauana(reserva),
  });
}