// Teste automatizado para validação integral da API Backend
const BASE_URL = 'http://localhost:5000/api';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('🧪 Iniciando Bateria de Testes Automatizados da API...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, title, errorDetail = '') => {
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title} - ${errorDetail}`);
      failed++;
    }
  };

  const testEmail1 = `user1_${Date.now()}@teste.com`;
  const testEmail2 = `user2_${Date.now()}@teste.com`;
  let tokenUser1 = '';
  let tokenUser2 = '';
  let user1TaskId = '';

  try {
    // 1. Healthcheck
    console.log('--- 1. Testando Healthcheck ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Endpoint de Healthcheck responde 200 OK');
    assert(healthData.status === 'success', 'Status da API é success');

    // 2. Registro de Usuário 1
    console.log('\n--- 2. Testando Autenticação & Cadastro ---');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Carlos Silva',
        email: testEmail1,
        senha: 'senhaSegura123'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'Cadastro de novo usuário retorna 201 Created');
    assert(!!regData.token, 'Token JWT retornado no cadastro');
    tokenUser1 = regData.token;

    // 3. Bloqueio de E-mail Duplicado
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Carlos Clone',
        email: testEmail1,
        senha: 'outraSenha123'
      })
    });
    assert(dupRes.status === 409, 'Cadastro com e-mail duplicado rejeitado com 409 Conflict');

    // 4. Validação Zod no Cadastro (Senha curta)
    const shortPassRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Joao',
        email: `joao_${Date.now()}@teste.com`,
        senha: '123'
      })
    });
    assert(shortPassRes.status === 400, 'Senha menor que 6 dígitos rejeitada com 400 Bad Request');

    // 5. Login Válido
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail1,
        senha: 'senhaSegura123'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Login com credenciais corretas retorna 200 OK');
    assert(loginData.usuario.email === testEmail1, 'Dados do usuário retornados no login');

    // 6. Login com Senha Incorreta
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail1,
        senha: 'senhaErrada123'
      })
    });
    assert(badLoginRes.status === 401, 'Login com senha incorreta retorna 401 Unauthorized');

    // 7. Rota Protegida /auth/me
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenUser1}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, 'Rota /api/auth/me autenticada retorna 200 OK');
    assert(meData.usuario.nome === 'Carlos Silva', 'Nome do usuário autenticado confere');

    // 8. Tentativa de Acesso sem Token
    console.log('\n--- 3. Testando Proteção de Rotas de Tarefas ---');
    const noAuthRes = await fetch(`${BASE_URL}/tasks`);
    assert(noAuthRes.status === 401, 'Listagem de tarefas sem token rejeitada com 401 Unauthorized');

    // 9. Criação de Tarefas
    console.log('\n--- 4. Testando CRUD de Tarefas ---');
    const createTaskRes1 = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenUser1}`
      },
      body: JSON.stringify({
        titulo: 'Implementar Testes Unitários',
        descricao: 'Cobrir endpoints de auth e tasks',
        status: 'pendente'
      })
    });
    const taskData1 = await createTaskRes1.json();
    assert(createTaskRes1.status === 201, 'Criação de tarefa 1 retorna 201 Created');
    user1TaskId = taskData1.data.id;

    const createTaskRes2 = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenUser1}`
      },
      body: JSON.stringify({
        titulo: 'Revisar Documentação README',
        descricao: 'Verificar se todos os critérios foram atendidos',
        status: 'concluida'
      })
    });
    assert(createTaskRes2.status === 201, 'Criação de tarefa 2 retorna 201 Created');

    // 10. Listagem e Estatísticas
    const listRes = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${tokenUser1}` }
    });
    const listData = await listRes.json();
    assert(listRes.status === 200, 'Listagem de tarefas retorna 200 OK');
    assert(listData.data.tarefas.length === 2, 'Usuário 1 possui 2 tarefas cadastradas');
    assert(listData.data.estatisticas.total === 2, 'Estatística total confere (2)');
    assert(listData.data.estatisticas.pendentes === 1, 'Estatística pendentes confere (1)');
    assert(listData.data.estatisticas.concluidas === 1, 'Estatística concluídas confere (1)');
    assert(listData.data.estatisticas.taxaConclusao === 50, 'Taxa de conclusão calculada corretamente (50%)');

    // 11. Filtro por Status
    const filterRes = await fetch(`${BASE_URL}/tasks?status=concluida`, {
      headers: { Authorization: `Bearer ${tokenUser1}` }
    });
    const filterData = await filterRes.json();
    assert(filterData.data.tarefas.length === 1, 'Filtro status=concluida retorna 1 tarefa');
    assert(filterData.data.tarefas[0].titulo === 'Revisar Documentação README', 'Tarefa concluída filtrada corretamente');

    // 12. Busca Textual
    const searchRes = await fetch(`${BASE_URL}/tasks?search=Testes`, {
      headers: { Authorization: `Bearer ${tokenUser1}` }
    });
    const searchData = await searchRes.json();
    assert(searchData.data.tarefas.length === 1, 'Busca por "Testes" retorna 1 tarefa correspondente');

    // 13. Alternar Status (PATCH /status)
    const toggleRes = await fetch(`${BASE_URL}/tasks/${user1TaskId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenUser1}` }
    });
    const toggleData = await toggleRes.json();
    assert(toggleRes.status === 200, 'Alternância rápida de status retorna 200 OK');
    assert(toggleData.data.status === 'concluida', 'Status alternado com sucesso para concluida');

    // 14. Atualização Completa (PUT)
    const updateRes = await fetch(`${BASE_URL}/tasks/${user1TaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenUser1}`
      },
      body: JSON.stringify({
        titulo: 'Implementar Testes Unitários e de Integração',
        descricao: 'Atualizado com sucesso'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'Atualização de tarefa retorna 200 OK');
    assert(updateData.data.titulo === 'Implementar Testes Unitários e de Integração', 'Título atualizado');

    // 15. Isolamento entre Usuários (Multi-tenant)
    console.log('\n--- 5. Testando Isolamento de Dados entre Usuários ---');
    const reg2Res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Mariana Costa',
        email: testEmail2,
        senha: 'senhaMariana456'
      })
    });
    const reg2Data = await reg2Res.json();
    tokenUser2 = reg2Data.token;

    // Usuário 2 não deve ver tarefas do Usuário 1
    const list2Res = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${tokenUser2}` }
    });
    const list2Data = await list2Res.json();
    assert(list2Data.data.tarefas.length === 0, 'Usuário 2 recém-criado possui 0 tarefas (isolamento OK)');

    // Usuário 2 tenta deletar tarefa do Usuário 1 (deve falhar com 404)
    const hackDeleteRes = await fetch(`${BASE_URL}/tasks/${user1TaskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenUser2}` }
    });
    assert(hackDeleteRes.status === 404, 'Tentativa de Usuário 2 deletar tarefa de Usuário 1 bloqueada com 404 Not Found');

    // 16. Exclusão da Tarefa pelo Usuário 1
    console.log('\n--- 6. Testando Exclusão de Tarefa ---');
    const deleteRes = await fetch(`${BASE_URL}/tasks/${user1TaskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenUser1}` }
    });
    assert(deleteRes.status === 200, 'Usuário 1 deleta sua própria tarefa com sucesso (200 OK)');

    const finalListRes = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${tokenUser1}` }
    });
    const finalListData = await finalListRes.json();
    assert(finalListData.data.tarefas.length === 1, 'Lista do Usuário 1 agora contém apenas 1 tarefa');

    console.log('\n========================================');
    console.log(`🎉 Bateria Concluída: ${passed} PASSADOS | ${failed} FALHADOS`);
    console.log('========================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro durante a execução dos testes:', error);
    process.exit(1);
  }
}

runTests();
