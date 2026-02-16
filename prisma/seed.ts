import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Check if users exist
    const count = await prisma.user.count()
    if (count === 0) {
        await prisma.user.createMany({
            data: [
                { name: 'Persona 1', amount: 0 },
                { name: 'Persona 2', amount: 0 },
            ],
        })
        console.log('Seeded 2 users')
    }

    // Check if categories exist
    const catCount = await prisma.category.count()
    if (catCount === 0) {
        await prisma.category.createMany({
            data: [
                { name: 'Comida', icon: 'utensils' },
                { name: 'Transporte', icon: 'car' },
                { name: 'Servicios', icon: 'zap' },
                { name: 'Entretenimiento', icon: 'tv' },
                { name: 'Salud', icon: 'activity' },
                { name: 'Otros', icon: 'circle-ellipsis' },
            ],
        })
        console.log('Seeded default categories')
    }

    // Check if payment methods exist
    const pmCount = await prisma.paymentMethod.count()
    if (pmCount === 0) {
        await prisma.paymentMethod.createMany({
            data: [
                { name: 'Efectivo' },
                { name: 'Transferencia' },
                { name: 'Tarjeta Crédito' },
                { name: 'Tarjeta Débito' },
            ],
        })
        console.log('Seeded payment methods')
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
