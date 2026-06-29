"use client";

import { useEffect, useMemo, useState } from "react";

type Reserva = {
  id: string;
  horaInicio: string;
  horaFim: string;
};

type Bloqueio = {
  id: string;
  horaInicio: string;
  horaFim: string;
};

const horarios = [
  { inicio: "08:00", fim: "09:00" },
  { inicio: "09:00", fim: "10:00" },
  { inicio: "10:00", fim: "11:00" },
  { inicio: "11:00", fim: "12:00" },
  { inicio: "13:00", fim: "14:00" },
  { inicio: "14:00", fim: "15:00" },
  { inicio: "15:00", fim: "16:00" },
  { inicio: "16:00", fim: "17:00" },
  { inicio: "17:00", fim: "18:00" },
];

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AgendaSalaPage() {
  const [data, setData] = useState(hojeISO());
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [loading, setLoading] = useState(false);

  const [horarioSelecionado, setHorarioSelecionado] = useState<{
    inicio: string;
    fim: string;
  } | null>(null);

  const [form, setForm] = useState({
    nome: "",
    crm: "",
    especialidade: "",
    telefone: "",
    email: "",
    observacao: "",
  });

  async function carregarReservas() {
    setLoading(true);

    try {
      const res = await fetch(`/api/agenda-reservas?data=${data}`, {
        cache: "no-store",
      });

      const text = await res.text();

      let json: any = {};

      try {
        json = JSON.parse(text);
      } catch {
        console.error("Resposta não era JSON:", text);
        alert("Erro na API. Veja o console do navegador ou terminal.");
        return;
      }

      if (!res.ok) {
        alert(json.error || "Erro ao carregar reservas.");
        return;
      }

      setReservas(json.reservas || []);
      setBloqueios(json.bloqueios || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarReservas();
  }, [data]);

  const ocupados = useMemo(() => {
    const lista = [...reservas, ...bloqueios];

    return lista.map((item) => `${item.horaInicio}-${item.horaFim}`);
  }, [reservas, bloqueios]);

  function estaOcupado(inicio: string, fim: string) {
    return ocupados.includes(`${inicio}-${fim}`);
  }

  async function confirmarReserva() {
    if (!horarioSelecionado) return;

    const payload = {
      ...form,
      telefone: form.telefone.replace(/\D/g, ""),
      data,
      horaInicio: horarioSelecionado.inicio,
      horaFim: horarioSelecionado.fim,
    };
    const res = await fetch("/api/agenda-reservas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    let json: any = {};

    try {
      json = JSON.parse(text);
    } catch {
      console.error("Resposta não era JSON:", text);
      alert("Erro na API. Veja o console do navegador ou terminal.");
      return;
    }

    if (!res.ok) {
      alert(json.error || "Erro ao reservar horário.");
      return;
    }

    alert("Reserva realizada com sucesso!");

    setHorarioSelecionado(null);
    setForm({
      nome: "",
      crm: "",
      especialidade: "",
      telefone: "",
      email: "",
      observacao: "",
    });

    carregarReservas();
  }

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
      return `(${numeros}`;
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }

  return (
    <main className="min-h-screen bg-[#F8F3EF] px-4 py-8 text-stone-900">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">
            Agenda de consultório
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 md:text-5xl">
            Reserve a sala
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-500">
            Escolha um dia e horário disponível para utilização do consultório.
            Após a confirmação, você receberá um e-mail com os detalhes da
            reserva.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-stone-700">
              Selecione a data
            </label>

            <input
              type="date"
              value={data}
              min={hojeISO()}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
            />

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-stone-600">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                Horário disponível
              </div>

              <div className="flex items-center gap-2 text-stone-600">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                Horário ocupado
              </div>
            </div>
          </aside>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-stone-900">
                  Horários disponíveis
                </h2>

                <p className="text-sm text-stone-500">
                  Data selecionada: {data.split("-").reverse().join("/")}
                </p>
              </div>

              {loading && (
                <span className="text-sm text-stone-400">Carregando...</span>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {horarios.map((horario) => {
                const ocupado = estaOcupado(horario.inicio, horario.fim);

                return (
                  <button
                    key={`${horario.inicio}-${horario.fim}`}
                    type="button"
                    disabled={ocupado}
                    onClick={() => setHorarioSelecionado(horario)}
                    className={[
                      "rounded-2xl border p-5 text-left transition",
                      ocupado
                        ? "cursor-not-allowed border-rose-100 bg-rose-50 text-rose-400"
                        : "border-stone-200 bg-white text-stone-900 hover:border-stone-400 hover:bg-stone-50",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-lg">
                        {horario.inicio} às {horario.fim}
                      </strong>

                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          ocupado
                            ? "bg-rose-100 text-rose-500"
                            : "bg-emerald-100 text-emerald-700",
                        ].join(" ")}
                      >
                        {ocupado ? "Ocupado" : "Reservar"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      {horarioSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h3 className="text-2xl font-semibold text-stone-900">
                Confirmar reserva
              </h3>

              <p className="mt-1 text-sm text-stone-500">
                {data.split("-").reverse().join("/")} das{" "}
                {horarioSelecionado.inicio} às {horarioSelecionado.fim}
              </p>
            </div>

            <div className="grid gap-3">
              <input
                placeholder="Nome completo *"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-400"
              />

              <input
                placeholder="CRM"
                value={form.crm}
                onChange={(e) => setForm({ ...form, crm: e.target.value })}
                className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-400"
              />

              <input
                placeholder="Especialidade"
                value={form.especialidade}
                onChange={(e) =>
                  setForm({ ...form, especialidade: e.target.value })
                }
                className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-400"
              />

              <input
                type="tel"
                placeholder="Telefone *"
                value={form.telefone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    telefone: formatarTelefone(e.target.value),
                  })
                }
                className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-400"
              />

              <input
                placeholder="E-mail *"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-400"
              />

              <textarea
                placeholder="Observações"
                value={form.observacao}
                onChange={(e) =>
                  setForm({ ...form, observacao: e.target.value })
                }
                className="min-h-24 rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-400"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setHorarioSelecionado(null)}
                className="flex-1 rounded-2xl border border-stone-200 px-4 py-3 font-semibold text-stone-600"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarReserva}
                className="flex-1 rounded-2xl bg-stone-900 px-4 py-3 font-semibold text-white"
              >
                Confirmar reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}