import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizarData(data: string) {
  return new Date(`${data}T00:00:00`);
}

export async function GET(req: NextRequest) {
  try {
    const data = req.nextUrl.searchParams.get("data");

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
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar reservas." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const reserva = await prisma.reservaSala.create({
      data: {
        ...body,
        data: normalizarData(body.data),
      },
    });

    return NextResponse.json(reserva);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao salvar reserva." },
      { status: 500 }
    );
  }
}