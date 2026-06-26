import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function normalizarData(data: string) {
  return new Date(`${data}T00:00:00`);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");

  if (!data) {
    return NextResponse.json(
      { error: "Data não informada." },
      { status: 400 }
    );
  }

  const dataReserva = normalizarData(data);

  const reservas = await prisma.reservaSala.findMany({
    where: {
      data: dataReserva,
      status: "CONFIRMADA",
    },
    orderBy: {
      horaInicio: "asc",
    },
  });

  const bloqueios = await prisma.bloqueioSala.findMany({
    where: {
      data: dataReserva,
    },
    orderBy: {
      horaInicio: "asc",
    },
  });

  return NextResponse.json({
    reservas,
    bloqueios,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nome,
      crm,
      especialidade,
      telefone,
      email,
      data,
      horaInicio,
      horaFim,
      observacao,
    } = body;

    if (!nome || !telefone || !email || !data || !horaInicio || !horaFim) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    const dataReserva = normalizarData(data);

    const reservaExistente = await prisma.reservaSala.findFirst({
      where: {
        data: dataReserva,
        horaInicio,
        horaFim,
        status: "CONFIRMADA",
      },
    });

    if (reservaExistente) {
      return NextResponse.json(
        { error: "Esse horário já está reservado." },
        { status: 409 }
      );
    }

    const bloqueioExistente = await prisma.bloqueioSala.findFirst({
      where: {
        data: dataReserva,
        horaInicio,
        horaFim,
      },
    });

    if (bloqueioExistente) {
      return NextResponse.json(
        { error: "Esse horário está indisponível." },
        { status: 409 }
      );
    }

    const reserva = await prisma.reservaSala.create({
      data: {
        nome,
        crm,
        especialidade,
        telefone,
        email,
        data: dataReserva,
        horaInicio,
        horaFim,
        observacao,
      },
    });

    return NextResponse.json({
      message: "Reserva criada com sucesso.",
      reserva,
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Esse horário já foi reservado." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar reserva." },
      { status: 500 }
    );
  }
}