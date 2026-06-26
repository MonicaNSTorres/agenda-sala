-- CreateTable
CREATE TABLE "ReservaSala" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "crm" TEXT,
    "especialidade" TEXT,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "observacao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMADA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReservaSala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloqueioSala" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BloqueioSala_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReservaSala_data_horaInicio_horaFim_key" ON "ReservaSala"("data", "horaInicio", "horaFim");

-- CreateIndex
CREATE UNIQUE INDEX "BloqueioSala_data_horaInicio_horaFim_key" ON "BloqueioSala"("data", "horaInicio", "horaFim");
