import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { enviarEmailReserva } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function GET(req: NextRequest) {
  try {
    const prisma = await getPrisma();

    const data = req.nextUrl.searchParams.get("data");

    if (!data) {
      return NextResponse.json(
        { error: "Data não informada." },
        { status: 400 }
      );
    }

    const reservas = await prisma.$queryRaw`
      SELECT *
      FROM "ReservaSala"
      WHERE "data" = ${data}
        AND "status" = 'CONFIRMADA'
      ORDER BY "horaInicio" ASC
    `;

    const bloqueios = await prisma.$queryRaw`
      SELECT *
      FROM "BloqueioSala"
      WHERE "data" = ${data}
      ORDER BY "horaInicio" ASC
    `;

    return NextResponse.json({ reservas, bloqueios });
  } catch (error) {
    console.error("Erro GET /api/agenda-reservas:", error);

    return NextResponse.json(
      { error: "Erro ao buscar reservas." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();

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

    const reservaExistente: any[] = await prisma.$queryRaw`
      SELECT "id"
      FROM "ReservaSala"
      WHERE "data" = ${data}
        AND "horaInicio" = ${horaInicio}
        AND "horaFim" = ${horaFim}
        AND "status" = 'CONFIRMADA'
      LIMIT 1
    `;

    if (reservaExistente.length > 0) {
      return NextResponse.json(
        { error: "Esse horário já está reservado." },
        { status: 409 }
      );
    }

    const bloqueioExistente: any[] = await prisma.$queryRaw`
      SELECT "id"
      FROM "BloqueioSala"
      WHERE "data" = ${data}
        AND "horaInicio" = ${horaInicio}
        AND "horaFim" = ${horaFim}
      LIMIT 1
    `;

    if (bloqueioExistente.length > 0) {
      return NextResponse.json(
        { error: "Esse horário está indisponível." },
        { status: 409 }
      );
    }

    const id = randomUUID();

    const reserva: any[] = await prisma.$queryRaw`
  INSERT INTO "ReservaSala" (
    "id",
    "nome",
    "crm",
    "especialidade",
    "telefone",
    "email",
    "data",
    "horaInicio",
    "horaFim",
    "observacao",
    "status",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    ${id},
    ${nome},
    ${crm || null},
    ${especialidade || null},
    ${telefone},
    ${email},
    ${data},
    ${horaInicio},
    ${horaFim},
    ${observacao || null},
    'CONFIRMADA',
    NOW(),
    NOW()
  )
  RETURNING *
`;

    await enviarEmailReserva({
      nome,
      crm: crm || null,
      especialidade: especialidade || null,
      telefone,
      email,
      data,
      horaInicio,
      horaFim,
      observacao: observacao || null,
    });

    return NextResponse.json({
      message: "Reserva criada com sucesso.",
      reserva: reserva[0],
    });
  } catch (error: any) {
    console.error("Erro POST /api/agenda-reservas:", error);

    if (error?.code === "P2010" || error?.meta?.code === "23505") {
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