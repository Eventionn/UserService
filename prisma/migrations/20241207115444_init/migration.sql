-- CreateTable
CREATE TABLE "Users" (
    "userID" UUID NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "phone" INTEGER,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loginType" TEXT NOT NULL,
    "usertype_id" UUID NOT NULL,
    "profilePicture" VARCHAR(255),

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
    "localtown_id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("addressID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Addresses_user_id_key" ON "Addresses"("user_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_usertype_id_fkey" FOREIGN KEY ("usertype_id") REFERENCES "UserTypes"("userTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
