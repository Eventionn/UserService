import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const usersData = [ // we only have on user here
  {
    email: 'email@domain.com',
    name: 'name'
  }
]

const userTypesData = [
  { type: 'Utilizador' },
  { type: 'Anunciante' },
  { type: 'Admin' },
];

const main = async () => {
  console.log('start seeding …') 
  // for (const _user of usersData) {
  //   const user = await prisma.user.create({
  //     data: _user,
  //   });
  //   console.log(`Created user with id: ${user.id}`);
    
  // }
  for (const userType of userTypesData) {
    const createdUserType = await prisma.userType.create({
      data: userType,
    });
    console.log(`Created UserType: ${createdUserType.type}`);
  }
  console.log('seeding done');
}

main()
  .catch(e => {
    console.error('foo', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })