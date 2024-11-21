-- CreateTable
CREATE TABLE "Users" (
    "userID" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loginType" TEXT NOT NULL,
    "usertype_id" UUID NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "UserTypes" (
    "userTypeID" UUID NOT NULL,
    "type" VARCHAR(20) NOT NULL,

    CONSTRAINT "UserTypes_pkey" PRIMARY KEY ("userTypeID")
);

-- CreateTable
CREATE TABLE "Addresses" (
    "addressID" TEXT NOT NULL,
    "road" VARCHAR(20) NOT NULL,
    "roadNumber" INTEGER NOT NULL,
    "postCode" VARCHAR(20) NOT NULL,
    "NIF" VARCHAR(20),
    "localtown_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("addressID")
);

-- CreateTable
CREATE TABLE "Locations" (
    "localtownID" SERIAL NOT NULL,
    "localtown" VARCHAR(100) NOT NULL,
    "city" VARCHAR(20) NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("localtownID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Addresses_user_id_key" ON "Addresses"("user_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_usertype_id_fkey" FOREIGN KEY ("usertype_id") REFERENCES "UserTypes"("userTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_localtown_id_fkey" FOREIGN KEY ("localtown_id") REFERENCES "Locations"("localtownID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
