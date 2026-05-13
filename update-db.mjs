import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const section = await prisma.eventSection.findUnique({
    where: { sectionKey: 'founders' }
  });
  
  if (section && section.content) {
    const content = section.content;
    content.founder1Name = 'DRA YEZENIA PARIONA';
    
    await prisma.eventSection.update({
      where: { sectionKey: 'founders' },
      data: { content: content }
    });
    console.log('Base de datos actualizada con el nombre corto');
  } else {
    console.log('No se encontro la seccion founders');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
