const SUPABASE_URL = 'https://zvfshfyombjogsuaasjq.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_QPxQtNvxslk4JFVFCuAVsg_PWam9cGD'; 

// Mudamos o nome da constante aqui para 'supabaseClient' para evitar o erro de duplicação:
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Arquivo database.js carregado e Supabase inicializado com sucesso!");

// --- FUNÇÃO DE LOGIN DO COMMANDABAR ---
async function manipularLogin() {
  // 1. Pega os valores que o usuário digitou na tela
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  // 2. Verifica se o usuário não deixou nada em branco
  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  console.log("Tentando fazer login com:", email);

  // 3. Envia os dados para o Supabase validar
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  // 4. Trata a resposta do banco de dados
  if (error) {
    // Se a senha estiver errada ou o usuário não existir, entra aqui:
    alert("Erro ao entrar: " + error.message);
  } else {
    // Se estiver tudo certo, entra aqui:
    alert("Login efetuado com sucesso!");
    
    // Redireciona o usuário para a tela principal (Dashboard)
    window.location.href = 'dashboard.html';

// --- FUNÇÃO DE CADASTRO DO COMMANDABAR ---
async function manipularCadastro() {
  // 1. Pega os valores que o usuário digitou na tela de cadastro
  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroSenha').value;

  // 2. Verifica preenchimento básico
  if (!email || !senha) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // 3. Validação de tamanho mínimo de senha exigido pelo Supabase (6 caracteres)
  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres!");
    return;
  }

  console.log("Tentando cadastrar usuário:", email);

  // 4. Cadastra as credenciais no sistema de autenticação do Supabase
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: senha,
  });

  // 5. Trata a resposta
  if (error) {
    alert("Erro ao criar conta: " + error.message);
  } else {
    // Como desativamos a confirmação por e-mail no painel ontem, o usuário já entra ativo!
    alert("Conta criada com sucesso! Você já pode entrar no sistema.");
    
    // Redireciona o usuário para a página de login
    window.location.href = 'login.html';

  }
}
  }
}