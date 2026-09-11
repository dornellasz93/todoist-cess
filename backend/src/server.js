import app from './app.js';
import prisma from './prisma.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Testar conexão com banco de dados
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados SQLite estabelecida com sucesso!');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
      console.log(`📡 Rota de Healthcheck: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
