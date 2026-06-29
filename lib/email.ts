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

export async function enviarEmailReserva(reserva: ReservaEmail) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const dataBR = reserva.data.split("-").reverse().join("/");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2>Reserva confirmada</h2>
      <p><strong>Data:</strong> ${dataBR}</p>
      <p><strong>Horário:</strong> ${reserva.horaInicio} às ${reserva.horaFim}</p>
      <p><strong>Nome:</strong> ${reserva.nome}</p>
      <p><strong>CRM:</strong> ${reserva.crm || "-"}</p>
      <p><strong>Especialidade:</strong> ${reserva.especialidade || "-"}</p>
      <p><strong>Telefone:</strong> ${reserva.telefone}</p>
      <p><strong>E-mail:</strong> ${reserva.email}</p>
      <p><strong>Observação:</strong> ${reserva.observacao || "-"}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Agenda Sala" <${process.env.EMAIL_USER}>`,
    to: reserva.email,
    subject: "Sua reserva foi confirmada",
    html,
  });

  await transporter.sendMail({
    from: `"Agenda Sala" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TAUANA,
    subject: "Nova reserva da sala",
    html,
  });
}