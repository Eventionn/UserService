import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const usersData = [ // we only have on user here
  {
    email: 'email@domain.com',
    name: 'name'
  }
]

const userTypesData = [
  { userTypeID: '2c6aab42-7274-424e-8c10-e95441cb95c3',type: 'Utilizador' },
  { userTypeID: '123e4567-e89b-12d3-a456-426614174001',type: 'Anunciante' },
  { userTypeID: '123e4567-e89b-12d3-a456-426614174002',type: 'Admin' },
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