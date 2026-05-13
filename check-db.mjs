import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const section = await prisma.eventSection.findUnique({
    where: { sectionKey: 'about' }
  });
  console.log(JSON.stringify(section, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
